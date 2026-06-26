import validator from "validator"
import type { Request,Response } from 'express';
import {prisma} from "@repo/db"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const SignUp=async(req:Request,res:Response)=>{
    try {
        const {name,email,password}=req.body;
        console.log("abcd")
        if(!validator.isEmail(email)){
            return res.json({
                success:false,
                message:'enter valid email'
            })
        }
        if(!validator.isStrongPassword(password)){
            return res.json({
                success:false,
                message:'write strong password'
            })
        }
        if(!name){
           return res.json({
                success:false,
                message:'enter name'
            }) 
        }
       const isUserExist=await prisma.user.findFirst({
        where:{
            email:email
        }
       })
       if(isUserExist){
        return res.json({
                success:false,
                message:'user already exist! Go to Login page'
            })
       }
       const salt=await bcrypt.genSalt(10);
       const hashedPass=await bcrypt.hash(password,salt);
       const user= await prisma.user.create({
        data:{
            name,email,
            password:hashedPass
        },
        select:{
            id:true,
        }
       })
       const secret:jwt.Secret=process.env.JWT_SECRET !
       const token=jwt.sign({user_id:user.id},secret, { expiresIn: "7d" })
        return res.json({
                success:true,
                token:token
        })
    } catch (e) {
        console.log(`error while signup ${e}`)
         return res.json({
                success:false,
                message:'something went wrong'
        })
    }
}