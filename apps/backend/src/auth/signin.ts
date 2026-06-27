import { prisma } from "@repo/db";
import type { Request,Response } from "express"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
export const SignIn=async(req:Request,res:Response)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.json({
                success:false,
                message:'missing details'
            })
        }
        const user=await prisma.user.findFirst({
            where:{
                email
            },
            select:{
                id:true,
                password:true
            }
        })
        if(!user){
            return res.json({
                success:false,
                message:'user not found'
            })
        }
        const isPassMatch=await bcrypt.compare(password,user.password !)
        if(!isPassMatch){
            return res.json({
                success:false,
                message:'password incorrect'
            })
        }
        const secret:jwt.Secret=process.env.JWT_SECRET !
        const token=jwt.sign({user_id:user.id},secret, { expiresIn: "7d" })
        return res.json({
                success:true,
                token:token
        })
        }catch (e) {
        console.log(`error while signup ${e}`)
         return res.json({
                success:false,
                message:'something went wrong'
        })
    }
}