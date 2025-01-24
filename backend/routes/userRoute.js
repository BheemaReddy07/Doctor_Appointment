import express from 'express'
import { bookAppointment, cancelAppointment, checkSlotAvailability, getProfile, listAppointment, loginUser,  requestForgetPasswordOTP,  requestOTP, resetPassword, updateProfile, verifyOTPandRegister } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'


const userRouter = express.Router()

userRouter.post('/register/request-otp',requestOTP)
userRouter.post('/register/verifyotp-register',verifyOTPandRegister)
userRouter.post('/login',loginUser)
userRouter.post('/forgot/request-otp',requestForgetPasswordOTP)
userRouter.post('/forgot/reset',resetPassword)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/check-slot-availability',authUser,checkSlotAvailability)
export default userRouter