import React from 'react'
import { doctors } from '../assets/assets'
import {useNavigate} from 'react-router-dom'
const TopDoctors = () => {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col items-center  gap-4 my-16 text-grey-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
      <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors </p>
      <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {doctors.slice(0,10).map((item,index)=>(
          <div onClick={()=>navigate(`/appointment/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transititon-all duration-500' key={index} >
            <img className='bg-blue-50 ' src={item.image} alt="" />
            <div className='p-4'>
              <div className='flex items-center gap-2 text-center text-green-500'>
                <p className='w-2 h-2 rounded-full bg-green-500'></p><p>Available</p>
              </div>
              <p className='text-grey-900 text-lg font-medium'>{item.name}</p>
              <p className='text-grey-600 text-sm'>{item.speciality}</p>
            </div>
          </div>
           
        ))}
      </div>
      <button className='bg-blue-50 text-grey-600  px-12  py-3 mt-10 rounded-full'>more</button>
    </div>
  )
}

export default TopDoctors
