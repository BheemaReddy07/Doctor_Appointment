import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

//API to register the user
const registerUser = async (req,res) =>{
    try {
        const {name,email,password} = req.body
        if(!name || !email || !password){
            return res.json({success:false,message:"Missing Details"})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Not a valid email"})
        }

        if(password.length < 8){
            return res.json({success:false,message:"Enter a Strong Password "})
        }

        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(password,salt)
        
        const userData = {
            name,
            email,
            password:hashedPassword
        }

        const newUser = new userModel(userData)

        const user = await newUser.save()


        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({success:true,token})


    } catch (error) {
        res.json({success:false,message:error.message})
        console.log(error.message)
    }
}




//API for userLogin

const loginUser = async (req,res) =>{

    try {
        const {email,password} = req.body
        const user  = await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"No user Found"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
            
        }
        else{
            res.json({success:false,message:"Incorrect Password"})
        }

    } catch (error) {

        res.json({success:false,message:error.message})
        console.log(error.message)
        
    }

}


export {registerUser,loginUser}