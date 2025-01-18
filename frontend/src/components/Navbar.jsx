import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets';
import {PhoneOutlined,HomeOutlined,MedicineBoxOutlined,InfoCircleOutlined,HomeFilled,MedicineBoxFilled,InfoCircleFilled,PhoneFilled } from '@ant-design/icons';

import { NavLink,useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const {token,setToken,userData} = useContext(AppContext)
    

    const logout = () =>{
        setToken(false)
        localStorage.removeItem('token')
    }


  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-grey-400'>
        <img onClick={()=>navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to="/">
                <li className="py-1">
                <HomeFilled />  HOME
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </li>
            </NavLink >
            <NavLink to='/doctors'>
                <li className="py-1">
                <MedicineBoxFilled />    ALL DOCTORS
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </li>
            </NavLink>
            <NavLink to='/about'>
                <li className="py-1">
                <InfoCircleFilled />      ABOUT
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </li>
            </NavLink>
            <NavLink to='/contact'>
                <li className="py-1">
                <PhoneFilled />      CONTACT
                    <hr  className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
                </li>
            </NavLink>
        </ul>
        <div className='flex items-center gap-4'>
            {
                token
                ?<div className='flex items-center gap-2 cursor-pointer group relative '>
                    <img className='w-8 rounded-full' src={userData.image} alt="" />
                    <img className='w-2.5 ' src={assets.dropdown_icon} alt="" />
                    <div className='absolute top-0  right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <div className='min-w-48 bg-stone-100 flex flex-col gap-4 p-4'>
                            <p onClick={()=>navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                            <p onClick={()=>navigate('my-appointments')} className='hover:text-black cursor pointer'>My Appointments</p>
                            <p  onClick={logout} className='hover:text-black cursor pointer'>Logout</p>
                        </div>
                    </div>
                </div>
                :<button onClick={()=>navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>
            }
            <img  onClick={()=>setShowMenu(true)} className='w-6  ' src={assets.menu_icon} alt="" />

            {/**------mobile menu--------------------------------------------- */}
            <div className={`${showMenu ? "fixed w-3/5   md:w-2/12 shadow-xl":"h-0 w-0"}   right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                <div className='flex items-center justify-between px-5 py-6'>
                    <img className='w-20  ' src={assets.logo} alt="" />
                    <img className='w-5' onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt="" />
                </div>
                <ul className='flex flex-col  items-center gap-2 mt-5 px-5 text-large  font-medium  '>
                     <NavLink className='w-full  border-b border-gray-300'   onClick={()=>setShowMenu(false)} to={'/'}> <p className="w-full  px-4 py-2 rounded inline-block"><HomeOutlined /> Home</p></NavLink>   
                     <NavLink  className='w-full  border-b border-gray-300' onClick={()=>setShowMenu(false)} to={'/doctors'}> <p className="w-full px-4 py-2 rounded inline-block"> <MedicineBoxOutlined /> All Doctors</p></NavLink>
                     <NavLink className='w-full  border-b border-gray-300' onClick={()=>setShowMenu(false)} to={'/about'}> <p className=" w-full px-4 py-2 rounded inline-block"> <InfoCircleOutlined /> About</p></NavLink>
                     <NavLink className='w-full  border-b border-gray-300'  onClick={()=>setShowMenu(false)} to={'/contact'}> <p className="w-full px-4 py-2 rounded inline-block"><PhoneOutlined /> Contact</p></NavLink>
                </ul>
            </div>

             
        </div>

      
    </div>
  )
}

export default Navbar
