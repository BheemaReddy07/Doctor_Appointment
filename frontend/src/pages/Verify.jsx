import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import { useSearchParams,useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const Verify = () => {
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success') === 'true';
  const appointId = searchParams.get('appointId')
  const {backendurl,token} = useContext(AppContext)
  const navigate = useNavigate()
  const [isVerified,setIsVerified] = useState(false)


  useEffect(()=>{
    const verifyPayment = async () =>{
      try {
        const {data} = await axios.post(backendurl+'/api/user/verify-payment',{appointId,success},{headers:{token}})
        if(data.success){
          setIsVerified(true)

        }
        else{
          toast.error(data.message)
          setIsVerified(false)
        }
      } catch (error) {
        toast.error('verified failed')
        console.log(error.message)
      }
    }
    verifyPayment();
  },[backendurl,appointId,success])

 if(!isVerified){
  return (
    <div className='min-h-[60vh] grid place-items-center'>
      <div className='w-[100px] h-[100px] border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin'>

      </div>
    </div>
  )
 }
 if(isVerified){
  navigate('/my-appointments')
 }

  return (
    <div>
      
    </div>
  )
}

export default Verify
