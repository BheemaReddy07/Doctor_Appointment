import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
const Appointment = () => {


  const { docId } = useParams();
  const { doctors ,currencySymbol,backendurl,getDoctorsData ,token} = useContext(AppContext)

  const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT']
  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots,setDocSlots] = useState([])
  const [slotIndex,setSlotIndex] = useState(0)
  const [slotTime,setSlotTime] = useState('')
  const [appointments,setAppointments] = useState([])

  const fectchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
    console.log(docInfo)
  }

  const getAvailableSlot = async () =>{
    if (!docInfo || !docInfo.slots_booked) {
      // If docInfo or slots_booked is not available, skip processing
      return;
    }
    setDocSlots([])

    // getting current date

    let today = new Date()

    for(let i =0;i<7;i++){
      //getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate()+i)

      // settinfg end time of the date with index
      let endTime = new Date()
      endTime.setDate(today.getDate()+i)
      endTime.setHours(21,0,0,0)


      //setting hours 
      if (today.getDate() === currentDate.getDate()) {
        // Ensure currentDate starts from the next 30-minute slot
        let currentHour = today.getHours();
        let currentMinutes = today.getMinutes();
      
        if (currentMinutes > 30) {
          currentDate.setHours(currentHour + 1); // Move to the next hour
          currentDate.setMinutes(0);
        } else {
          currentDate.setHours(currentHour);
          currentDate.setMinutes(30);
        }
      
        // Ensure it starts no earlier than 10:00 AM
        if (currentDate.getHours() < 10) {
          currentDate.setHours(10);
          currentDate.setMinutes(0);
        }
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      
       let timeSlots = []
      while(currentDate<endTime){
        let formattedTime = currentDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})

       
        let day = currentDate.getDate()
        let month  = currentDate.getMonth() +1
        let year = currentDate.getFullYear()

        const slotDate  = day + "-" +month +"-"+year
        const slotTime = formattedTime

        const isSlotAvailable =  !(docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime));
        if(isSlotAvailable){
       //skip the slot for lunch break
       if(!(currentDate.getHours()===13 || currentDate.getHours()===17))
       {
         //add slots to array
         timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })
       }
        }
         
     
       

        //increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes()+30)

      }
      

      setDocSlots(prev =>([...prev,timeSlots]))
    }
  }

  const validateSlots = async (docId, slotDate, slotTime) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/user/check-slot-availability",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
  
      if (!data.success) {
        toast.error(data.message); // Display error only once
      }
  
      return data.success; // Return true or false
    } catch (error) {
      console.log(error);
      toast.error("Error validating slot availability"); // General error message
      return false; // Return false to indicate failure
    }
  };
  



  const bookAppointment = async () =>{
    
    if(!token){
          toast.warn('Login to book appointment')
          return navigate('/login')
    }

    try {
      const date = docSlots[slotIndex][0].datetime

      let day = date.getDate()
      let month = date.getMonth()+1
      let year = date.getFullYear()

      const slotDate = day + "-" +month +"-"+year
      
      const isAvailable = await validateSlots(docId,slotDate,slotTime);
      if(!isAvailable){
        toast.error('Slot is no longer available');
        return;
      }

      const {data} = await  axios.post(backendurl + '/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}})
      if(data.success){
        toast.success(data.message)
        getDoctorsData()
        fectchDocInfo()
        navigate('/my-appointments')
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

    
  }

   


  useEffect(() => {
    fectchDocInfo()
  }, [doctors, docId])

  useEffect(()=>{
    if (docInfo) {
      getAvailableSlot();
      getDoctorsData()
       
    }
  },[docInfo])

   



  return docInfo && (
    <div>
      {/**------------Docotors details----------------- */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/*-----------------docinfo:name,deg,experience---------------- */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}

            <img  className='w-4' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree}-{docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          {/**-------Doctor About ----------------------- */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>
     

   {/**----------------BOOKING SLOTS----------------- */}
   <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
    <p>Booking Slots</p>
    <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4 '>
      {
        docSlots.length && docSlots.map((item,index)=>(
          <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index ? 'bg-primary text-white':'border border-gray-200'}`} key={index}>
            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
            <p>{item[0] && item[0].datetime.getDate()}</p>
           
           
          </div>
        ))
      }
    </div>
     <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
      {docSlots.length && docSlots[slotIndex].map((item,index)=>(
         
          <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime ? 'text-white bg-primary':'text-gray-400 border border-gray-400'}`} key={index} >{item.time.toLowerCase()}</p>
         

      ))}
     </div>
     <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an Appointment</button>
   </div>
          {/**--------listing related doctos */}
          <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment
