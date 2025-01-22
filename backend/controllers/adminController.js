

import validator from "validator"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"


// API for adding doctor


const addDoctor = async (req,res) =>{
    try {
        const {name,email,password,speciality,degree,experience,about,fees,address} =req.body
        const imageFile = req.file

         //checking for all data to add to the doctor
         if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address ){
              return res.json({success:false,message:"Missing details"})
         }
          //validating the email

       if(!validator.isEmail(email)){
        return res.json({success:false,message:"please enter a Valid email"})
       }


       if(password.length < 8){
        return res.json({success:false,message:"Please enter a strong password"})
       }

       let salt = await bcrypt.genSalt(10)
       let hashedPassword = await bcrypt.hash(password,salt)



       const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})

        const imageUrl = imageUpload.secure_url

        const doctorData ={
            name,email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }
   const newDoctor = new doctorModel(doctorData)
   await newDoctor.save()
       
   res.json({success:true,message:"Doctor added"})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}



// API for admin Login 

const loginAdmin = async (req,res) =>{
    try {
        const {email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token =jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})

        }
        else{
            res.json({success:false,message:"Invalid credentials"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


//API to get all doctors list for admin panel

const allDoctors = async (req,res) =>{

    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }

}


//API TO GET ALL APPOINTMENTS FROM THE BACKEND FOR ADMIN

const appointmentsAdmin = async (req,res) =>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API FOR APPOINTMENT CANCELLATION
const appointmentCancel = async (req,res) =>{
    try {
      
      const { appointmentId} = req.body
  
      const appointmentData = await appointmentModel.findById(appointmentId)
   
       
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


  //API to get dashboard data for the admin panel
  const adminDashboard = async (req,res) =>{
    try {
        const doctors = await doctorModel.find({})
        const users  = await userModel.find({})
        const appointments  = await appointmentModel.find({})

        const dashData = {
            doctors :doctors.length,
            appointments :appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        res.json({success:true,dashData})
        
    } catch (error) {
        console.log(error);
      res.json({ success: false, message: "error" });
      
    }
  }

export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard}