import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'
export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const [aToken ,setAToken] = useState(localStorage.getItem('atoken')?localStorage.getItem('atoken'):"")
    const [doctors,setDoctors] = useState([])
    const [appointments,setAppointments] = useState([])
    const [dashData,setDashData] = useState(false)
 const backendurl = import.meta.env.VITE_BACKEND_URL


 const [adoctors,asetDoctors] = useState([])
    const getDoctorsData = async () =>{
        try {

            const {data} = await axios.get(backendurl+'/api/doctor/list')
            if(data.success){
                asetDoctors(data.doctors)
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


 const getAllDoctors = async () =>{
    try {
        const {data} = await axios.post(backendurl + '/api/admin/all-doctors',{},{headers:{aToken}})
        if(data.success){
            setDoctors(data.doctors)
            
        }
        else{
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.message)
        
    }
 }

 const changeAvailability = async (docId) =>{
    try {
         const {data}  = await axios.post(backendurl+'/api/admin/change-availability',{docId},{headers:{aToken}}) 
         
         if(data.success){
            toast.success(data.message)
            getAllDoctors()
         }
         else{
            toast.error(data.message)
            console.log(data.message)
             
         }
    } catch (error) {
        toast.error(error.message)
        console.log(error.message)
       
    }
 }

const getAllAppointments = async () =>{
    try {
        const {data} = await axios.get(backendurl+'/api/admin/appointments',{headers:{aToken}})
        if(data.success){
            setAppointments(data.appointments)
             
        }
        else{
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.message)
        console.log(error.message)
    }
}


const cancelAppointment = async (appointmentId) =>{
    try {
        const {data} = await axios.post(backendurl+'/api/admin/cancel-appointment',{appointmentId},{headers:{aToken}})
        if(data.success){
            toast.success(data.message)
            getDoctorsData()

        }
        else{
            toast.error(data.message)
        }
        
    } catch (error) {
        toast.error(error.message)
        console.log(error.message)
    }
    
}

const getDashData = async () =>{
    try {
        const {data} = await axios.get(backendurl+'/api/admin/dashboard',{headers:{aToken}})
        if(data.success)
        {
            setDashData(data.dashData)
        
        }
        else{
            toast.error(data.message)
            console.log(data.message)
        }
        
    } catch (error) {
        toast.error(error.message)
        console.log(error.message)
    }
}





    const  value = {
        aToken,setAToken,backendurl ,doctors,getAllDoctors,changeAvailability,getAllAppointments,appointments,setAppointments,cancelAppointment,getDashData,dashData,setDashData

    }

    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider