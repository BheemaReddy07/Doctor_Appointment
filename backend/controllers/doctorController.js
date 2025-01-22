import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
const changeAvailability = async (req,res) =>{
    try {
        
        const {docId} =req.body
        console.log(docId)
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true,message:"Availlability changed"})



    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        console.log(error.message)
    }
}


const doctorList = async (req,res) =>{
    try {
       const doctors = await doctorModel.find({}).select(['-password','-email'])

       res.json({success:true,doctors})

    } catch (error) {
        res.json({success:false,message:error.message})
        console.log(error.message)
    }
}

//API for doctor login
const loginDoctor = async (req,res) =>{
    try {
        const {email,password} = req.body
        const doctor = await doctorModel.findOne({email})
        if(!doctor){
            return res.json({success:false,message:"Invalid credentials"})
        }

        const isMatch = await bcrypt.compare(password,doctor.password)
        if(isMatch){
             const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
             res.json({success:true,token})
        }
        else{
            return res.json({success:false,message:"Invalid credentials"})
        }
        
    } catch (error) {
        res.json({success:false,message:error.message})
        console.log(error.message)
    }
}


//api to get docAppointments for doc panel
const appointmentsDoctor = async (req,res) =>{
    try {
        const {docId} = req.body
        const appointments = await appointmentModel.find({docId})

        res.json({success:true,appointments})
        
    } catch (error) {
        res.json({success:false,message:error.message})
        console.log(error.message)
    }
}

//api to mark appointment completed for doctor panel
const appointmentComplete = async (req,res) =>{
    try {
        const {docId,appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId){
              await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
            return res.json({success:true,message:"Appointment Completed"})
        }
        else{
            return res.json({success:true,message:"Mark Failed"})
        }

        
    } catch (error) {
        res.json({success:false,message:error.message})
        console.log(error.message)
    }
}
//api to mark appointment cancel for doctor panel
const appointmentCancel = async (req,res) =>{
    try {
        const {docId,appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId){
              await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
              const {docId,slotDate,slotTime} = appointmentData
  
              const doctorData = await doctorModel.findById(docId)
          
              let slots_booked = doctorData.slots_booked
              slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
          
            await doctorModel.findByIdAndUpdate(docId,{slots_booked})
          
            return res.json({success:true,message:"Appointment Cancelled"})
        }
        else{
            return res.json({success:true,message:"Cancellation Failed"})
        }

        
    } catch (error) {
        res.json({success:false,message:error.message})
        console.log(error.message)
    }
}


//api to get dashboard data for doctor panel

const doctorDashboard = async (req,res) =>{
    try {
        const {docId} = req.body
        const appointments = await appointmentModel.find({docId})
        let earnings = 0
        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings +=item.amount
            }
        })

        let patients = []
        appointments.map((item)=>{
         if(!patients.includes(item.userId)){
            patients.push(item.userId)
         }

        })

        const dashData = {
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        res.json({success:true,dashData})
    } catch (error) {
        res.json({success:false,message:error.message})
        console.log(error.message)
    }
}

//api to get doctors profile for Doctor panel
const doctorProfile = async (req,res) =>{
    try {
        const {docId} = req.body
        const profileData  = await doctorModel.findById(docId).select('-password')
        res.json({success:true,profileData})
        
    } catch (error) {
        res.json({success:false,message:error.message})
        console.log(error.message)
    }

}



//api to update doctor profile data from doctor panel
const updateDoctorProfile = async (req,res) =>{
    try {
        const {docId,fees,address,available} = req.body

        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
        res.json({success:true,message:"Profile Updated"})
        
    } catch (error) {
        res.json({success:false,message:error.message})
        console.log(error.message)
    }
}

export {changeAvailability ,doctorList,loginDoctor,appointmentsDoctor,appointmentComplete,appointmentCancel,doctorDashboard,doctorProfile,updateDoctorProfile}

