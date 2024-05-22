import { comparePassword, hashPassword } from "../helpers/authHelper.js"
import userModel from "../models/userModel.js"
import JWT from 'jsonwebtoken'

export const registerController = async (req,resp)=>{
  try{
        const {name,email,password,phone,address} = req.body
        //validations
        if(!name){
            return resp.send({error:'Name is Required'})
        }
        if(!email){
            return resp.send({error:'Email is Required'})
        }
        if(!password){
            return resp.send({error:'Password is Required'})
        }
        if(!phone){
            return resp.send({error:'Phone is Required'})
        }
        if(!address){
            return resp.send({error:'Address is Required'})
        }

        //check user
        const existingUser = await userModel.findOne({email})
        //existing user
        if(existingUser){
            return resp.status(200).send({
                success:true,
                message:'Already Register please login'
            })
        }

        //register user 
        const hashedPassword = await hashPassword(password)

        //save
        const user = await new userModel({name,email,phone,address,password:hashedPassword}).save()
        resp.status(201).send({
            success:true,
            message:"User register successfully",
            user,
        })

  }catch(error){
    console.log(error)
    resp.status(500).send({
        success:false,
        message:"Error in registration",
        error
    })
  }
}

//Post Login
export const loginController =async (req,resp)=>{
    try{
        const {email,password} = req.body
        //validation
        if(!email || !password){
            return resp.status(404).send({
                success:false,
                message:'invalid email or password'
            })
        }
        //check user
        const user = await userModel.findOne({email})
        if(!user){
            return resp.status(404).send({
                success:fakse,
                message:"Email is not register"
            })
        }
        const match = await comparePassword(password, user.password)
        if(!match){
            return resp.status(200).send({
                success:false,
                message:"Invalid Password"
            })
        }
        //token
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn:'7d'});
        resp.status(200).send({
            success:true,
            message:'Login successfully',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,               
            },
            token,
        })

    }
    catch(error){
        console.log(error)
        resp.status(500).send({
            success:false,
            message:'Error in login',
            error
        })
    }
};

//test controller
export const testController = (req,resp)=>{
    resp.send('Protected Route')
};
