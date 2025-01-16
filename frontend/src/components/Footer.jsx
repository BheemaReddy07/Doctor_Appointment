import React, { Profiler } from 'react'
import { assets } from '../assets/assets'
import {useNavigate} from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()
  return (
    <div className='md:mx-10'>


      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>
          {/**------------------left section--------------------------- */}
      <div>
        <img className='mb-5 w-40' src={assets.logo} alt="" />
        <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      </div>


        {/**------------------middle section--------------------------- */}
      <div>
        <p className='text-xl font-medium mb-5'>Company</p>
        <ul className='flex flex-col gap-2 text-gray-600'>
            <li className='cursor-pointer' onClick={()=>{navigate('/');scrollTo(0,0)}}>Home</li>
            <li className='cursor-pointer' onClick={()=>{navigate('/about');scrollTo(0,0)}}>About Us</li>
            <li className='cursor-pointer' onClick={()=>{navigate('/contact');scrollTo(0,0)}}>Contact Us</li>
            <li className='cursor-pointer' onClick={()=>{navigate('/');scrollTo(0,0)}}>Privacy policy</li>
        </ul>
      </div>

        {/**------------------right section--------------------------- */}
        <div>
             <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-3 text-gray-600'>
                <li>+91 77994 47698</li>
                <li><a href='mailto:bheemareddy29102003@gmail.com'>bheemareddy29102003@gmail.com</a></li>
            </ul>
        </div>
      </div>

   
     {/**------------------copy right rtext--------------------------- */}

        <div>
        < hr />
        <p className='py-5 text-sm text-center'>Copyright 2025@ Prescripto -All Rights Reserved</p>
        </div>
    </div>
  )
}

export default Footer
