import { createContext } from "react";
import {useNavigate} from 'react-router-dom'
import { useState } from "react";
import {toast} from 'react-toastify'
import axios from 'axios'
export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const navigate = useNavigate()

    const backendurl = import.meta.env.VITE_BACKEND_URL
    const [dToken,setDToken] = useState(localStorage.getItem('dtoken') ? localStorage.getItem('dtoken'):"")
    const [appointments,setAppointments] = useState([])

    const [dashData,setDashData] = useState(false)
    const [profileData,setProfileData] = useState(false)

    const calculateAge = (dob) =>{
    const today = new Date()
    const birthDate  = new Date(dob)

    const age = today.getFullYear() - birthDate.getFullYear()

    return age
}

    const getAppointments = async () =>{
        try {
            const {data} = await axios.get(backendurl+'/api/doctor/appointments',{headers:{dToken}})
            if(data.success){
                setAppointments(data.appointments.reverse())
                

            }
            else{
                toast.error(data.message)
            }

            
        } catch (error) {
            console.log(error.message);
            toast.error(error.message)
            
        }
    }

 const completeAppointment = async (appointmentId) =>{
    try {
        const {data} = await axios.post(backendurl+'/api/doctor/complete-appointment',{appointmentId},{headers:{dToken}})
        if(data.success){
            toast.success(data.message)
            getAppointments()
        }
        else{
            toast.error(data.message)
        }
        
    } catch (error) {
        console.log(error.message);
            toast.error(error.message)
    }
 }


 const cancelAppointment = async (appointmentId) =>{
   try {
    const {data} = await axios.post(backendurl+'/api/doctor/cancel-appointment',{appointmentId},{headers:{dToken}})
    if(data.success){
        toast.success(data.message)
        getAppointments()
    }
    else{
        toast.error(data.message)
    }

   } catch (error) {
    console.log(error.message);
    toast.error(error.message)
   }
 }


const getDashData = async () =>{
    try {

        const {data} = await axios.get(backendurl +'/api/doctor/dashboard',{headers:{dToken}})
        if(data.success){
            setDashData(data.dashData)
             
        }
        else{
            toast.error(data.message)
        }
        
    } catch (error) {
        console.log(error.message);
    toast.error(error.message)
    }
}


const getProfileData = async () =>{
    try {
        const {data} = await axios.get(backendurl + '/api/doctor/profile',{headers:{dToken}})
        if(data.success){
            setProfileData(data.profileData)
            
        }
        else{
            toast.error(data.message)
        }
        
    } catch (error) {
        console.log(error.message);
        toast.error(error.message)
    }
}




    const  value = {
       dToken,setDToken,backendurl,appointments,setAppointments,getAppointments,completeAppointment,cancelAppointment ,dashData,setDashData,getDashData,profileData,setProfileData,getProfileData
    }

    return(
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider