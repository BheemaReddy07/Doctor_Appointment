import { createContext, useEffect, useState } from "react";
import { doctors } from "../assets/assets";
import axios from 'axios'
import {toast} from 'react-toastify'
export const AppContext = createContext()


const AppContextProvider = (props) =>{

    
    const currencySymbol = '₹'
    const [doctors,setDoctors] = useState([])
    const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'): false)
    const backendurl = import.meta.env.VITE_BACKEND_URL

    const [userData,setUserData]   = useState(false) 
    const getDoctorsData = async () =>{
        try {

            const {data} = await axios.get(backendurl+'/api/doctor/list')
            if(data.success){
                setDoctors(data.doctors)
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }



const loadUserProfileData = async () =>{
    try {


        const {data} = await axios.get(backendurl + '/api/user/get-profile',{headers:{token}})

        if(data.success){
            setUserData(data.userData)
            console.log(data.userData.address.line1)
        }
        else{
            toast.error(data.message)
        }
        
    } catch (error) {
        console.log(error)
        toast.error(error.message) 
    }
}








    const value ={
        doctors,currencySymbol,token,setToken ,backendurl,userData,setUserData,loadUserProfileData ,getDoctorsData
    }


   useEffect(()=>{
      getDoctorsData()
   },[])


   useEffect(()=>{
  if(token){
    loadUserProfileData()
  }
  else{
    setUserData(false)
  }
   },[token])


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider