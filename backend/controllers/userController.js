import validator from "validator";
import bcrypt, { genSalt } from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Stripe from 'stripe'


// function to create otp

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

//function to send otp

const sendOTPEmail = async (email, otp, name) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_SENDER_MAIL_NEW,
      pass: process.env.MAIL_SENDER_EMAIL_NEW_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_SENDER_EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Hi ${
      name ? name : ""
    }!! Greetings from Prescripto, here is your OTP code: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully!");
  } catch (error) {
    console.log("Error sending email:", error.message);
    throw new Error("Error sending OTP email");
  }
};
//API to register the user
const requestOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Not a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a Strong Password" });
    }

    const user = await userModel.findOne({ email });
    if (user && user.verified) {
      return res.json({ success: false, message: "User already exists" });
    }

    const otp = generateOTP(); // Ensure function is called
    console.log(otp);
    const otpExpiration = Date.now() + 3 * 60 * 1000;

    if (user && !user.verified) {
      user.otp = otp;
      user.otpExpiration = otpExpiration;
      await user.save();
    } else {
      const userData = new userModel({
        name,
        email,
        password,
        otp,
        otpExpiration,
        verified: false,
      });

      console.log("Saving user:", userData); // Debug log
      await userData.save();
    }

    await sendOTPEmail(email, otp, name);
    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.log("Error in requestOTP:", error.message);
    res.json({ success: false, message: "Error sending OTP" });
  }
};

//API for the verify and register

const verifyOTPandRegister = async (req, res) => {
  const { email, otp, password, name, repassword } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "No User found" });
    }
    if (password != repassword) {
      return res.json({ success: false, message: "check the repassword" });
    }
    if (user.otp != otp || Date.now() > user.otpExpiration) {
      return res.json({ success: false, message: "Invalid or Expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await userModel.findByIdAndUpdate(user._id, {
      name,
      password: hashedPassword,
      otp: null,
      otpExpiration: null,
      verified: true,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token, message: "registration successfull" });
  } catch (error) {
    console.error("Error verifying OTP!!:", error);
    res.json({ success: false, message: "Error verifying OTP!!!" });
  }
};

//API for userLogin

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "No user Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Incorrect Password" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error.message);
  }
};

const requestForgetPasswordOTP = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiration = Date.now() + 3 * 60 * 1000;
    await user.save();

    await sendOTPEmail(email, otp, name); //send the otp to the email

    res.json({ success: true, message: "otp sent successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error.message);
  }
};

const resetPassword = async (req, res) => {
  const { email, password, repassword, otp } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "no user found" });
    }

    if (password !== repassword) {
      return res.json({
        success: false,
        message: "password not matching with repassword",
      });
    }
    if (user.otp !== otp || Date.now() > user.otpExpiration) {
      //checks if user entered otp and  otp in the database matches or not
      console.log("Invalid or expired OTP");
      return res.json({ success: false, message: "invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10); //encrypting the password
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiration = null;

    await user.save(); //saving the user

    res.json({ success: true, message: "password reset successfully!!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

const cleanupExpiredUsers = async (req, res) => {
  try {
    const now = Date.now(); // Get the current time

    // Find users who are not verified yet and whose OTP expiration time has passed
    const expiredUsers = await userModel.find({
      verified: false, // User has not been verified
      otpExpiration: { $lt: now }, // OTP expiration time has passed
    });

    if (expiredUsers.length > 0) {
      // If there are any expired users, delete them
      await userModel.deleteMany({
        verified: false, // User has not been verified
        otpExpiration: { $lt: now }, // OTP expiration time has passed
      });
      console.log(`${expiredUsers.length} expired users cleaned up.`);
    }
  } catch (error) {
    console.error("Error cleaning up expired users:", error);
  }
};

const HOUR = 1 * 60 * 1000; // 1 hour in milliseconds
setInterval(cleanupExpiredUsers, HOUR);

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel
      .findById(userId)
      .select(["-password", "-otp", "-otpExpiration", "-verified"]);
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !dob || !address || !gender) {
      return res.json({ success: true, message: "Missing details" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      dob,
      gender,
      address: JSON.parse(address),
    });

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor Not Available" });
    }
    let slots_booked = docData.slots_booked;

    //checking for slots availability

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ successs: false, message: "Slot Not Available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel
      .findById(userId)
      .select(["-password", "-otp", "-otpExpiration", "-verified"]);

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    //save new slots in dacData .
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};



//API to get user appointment for frontend my-appointment page

const listAppointment = async (req,res) =>{
   
  try {
    const {userId} = req.body

    const appointments = await appointmentModel.find({userId})

    res.json({success:true,appointments})


  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
    
  }
}




// API to cancel the appointment
const cancelAppointment = async (req,res) =>{
  try {
    
    const {userId , appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)
 
    //verify appointment user
    if(appointmentData.userId!=userId){
      return res.json({success:false,message:"Unauthorized access"})
    }
    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

    //releasing doctors slot

    const {docId,slotDate,slotTime} = appointmentData

    const doctorData = await doctorModel.findById(docId)

    let slots_booked = doctorData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

  await doctorModel.findByIdAndUpdate(docId,{slots_booked})


  res.json({success:true,message:"Appointment Cancelled"})

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
    
  }
}





const checkSlotAvailability = async(req,res) =>{
  try {
      const {docId,slotDate,slotTime} = req.body

      const docData = await doctorModel.findById(docId)
      const slots_booked = docData.slots_booked
      if(slots_booked[slotDate]  && slots_booked[slotDate].includes(slotTime)){
          return res.json({success:false,message:"Slot not available"})
      }
      res.json({success:true,message:"Slot Available"})
      
  } catch (error) {
      res.json({success:false,message:error.message})
      console.log(error.message)
      
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const paymentStripe = async (req,res) =>{
  try {
    const {appointmentId} = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if(!appointmentData || appointmentData.cancelled){
      return res.json({success:false,message:"Appointment not found"})
    }
    const session = await stripe.checkout.sessions.create({
      line_items:[
        {
          price_data:{
            currency:'inr',
            product_data:{
              name:appointmentData.docData.name,
              images:[appointmentData.docData.image],
              description:appointmentData.docData.speciality,

            },
            unit_amount:appointmentData.amount * 100 ,
          },
          quantity:1,
        }
      ],
      mode:'payment',
      success_url:`${process.env.FRONTEND_URL}/verify?success=true&appointId=${appointmentData._id}`,
      cancel_url:`${process.env.FRONTEND_URL}/verify?success=false&appointId=${appointmentData._id}`,
    })
    res.json({success:true,success_url:session.url})
    
  } catch (error) {
    res.json({success:false,message:error.message})
    console.log(error.message)
  }
}
 
const verifyPayment = async (req,res) =>{
  try {
    const {appointId,success}  = req.body

    if(!appointId){
      return res.status(400).json({success:false,message:"Missing Appointment Id"})
    }

    const appoint = await appointmentModel.findById(appointId)
    if(!appoint){
      return res.status(404).json({success:false,message:"Transaction not found"})
    }
    const userdata  = await userModel.findById(appoint.userId)
    if(!userdata){
      return res.status(404).json({success:false,message:"User not found"})
    }

    if(success){
      appoint.payment = true;
      await appoint.save();

      return res.status(200).json({success:true,message:"payment verified successfully"})
    }
    return res.status(400).json({success:true,message:"payment not completed"})
    
  } catch (error) {
    res.json({success:false,message:error.message})
    console.log(error.message)
  }
}

export {
  requestOTP, loginUser, verifyOTPandRegister, requestForgetPasswordOTP, resetPassword, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment,checkSlotAvailability,paymentStripe ,verifyPayment
};
