import { hashPassword } from "../helpers/authHelper.js"
import userModel from "../models/userModel.js"

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

