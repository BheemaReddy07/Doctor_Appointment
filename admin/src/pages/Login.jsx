import React from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'
import {EyeInvisibleOutlined,EyeOutlined} from '@ant-design/icons'
const Login = () => {

  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { setAToken, backendurl } = useContext(AdminContext)
  const { setDToken, dToken } = useContext(DoctorContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendurl + '/api/admin/login', { email, password })
        if (data.success) {
          localStorage.setItem('atoken', data.token)
          setAToken(data.token)
          toast.success(data.message)
        }
        else {
          toast.error(data.message)

        }
      }
      else {
        const { data } = await axios.post(backendurl + '/api/doctor/login', { email, password })
        if (data.success) {
          localStorage.setItem('dtoken', data.token)
          setDToken(data.token)

          toast.success(data.message)
        }
        else {
          toast.error(data.message)

        }

      }

    } catch (error) {
      toast.error(error.message)
      console.log(error.message)
    }
  }



  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center '>
      <div className='flex flex-col gap-3  m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-xl'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span> Login</p>
        <div className='w-full' >
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className="w-full relative">
          <p className="text-sm text-gray-700">Password</p>
          <div className="relative">
            <input
              className="border border-[#DADADA] rounded w-full p-2 mt-1 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <EyeInvisibleOutlined
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <EyeOutlined
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
        </div>
        
        <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
        {
          state === "Admin"
            ? <p>Doctor Login? <span className='cursor-pointer text-primary underline' onClick={() => setState('Doctor')}>Click here</span></p>
            : <p>Admin Login? <span className='cursor-pointer text-primary underline' onClick={() => setState('Admin')}>Click here</span></p>
        }
      </div>

    </form>
  )
}

export default Login
