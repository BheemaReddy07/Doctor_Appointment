import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'
export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const [aToken ,setAToken] = useState(localStorage.getItem('atoken')?localStorage.getItem('atoken'):"")
    const [doctors,setDoctors] = useState([])
 const backendurl = import.meta.env.VITE_BACKEND_URL

 const getAllDoctors = async () =>{
    try {
        const {data} = await axios.post(backendurl + '/api/admin/all-doctors',{},{headers:{aToken}})
        if(data.success){
            setDoctors(data.doctors)
            console.log(data.doctors)
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
         console.log(docId)
         if(data.success){
            toast.success(data.message)
            getAllDoctors()
         }
         else{
            toast.error(data.message)
            console.log(data.message)
            console.log(docId)
         }
    } catch (error) {
        toast.error(error.message)
        console.log(error.message)
        console.log(docId)
    }
 }

    const  value = {
        aToken,setAToken,backendurl ,doctors,getAllDoctors,changeAvailability

    }

    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider