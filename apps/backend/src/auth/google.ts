import { prisma } from "@repo/db";
import axios from "axios";
import type { Request,Response } from "express"
import jwt from 'jsonwebtoken'

const client_id=process.env.CLIENT_ID;
const client_secret=process.env.CLIENT_SECRET;
const redirect_uri=process.env.REDIRECT_URI;
export const GoogleLogin=(req:Request,res:Response)=>{
    try {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=profile email`;
    res.redirect(url)
    } catch (error) {
         console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const GoogleCallback=async(req:Request,res:Response)=>{
    try {
        const {code}=req.query;
        const {data}=await axios.post('https://oauth2.googleapis.com/token',{
            client_id, client_secret, code, redirect_uri, 
            grant_type:'authorization_code'
        })
        const {access_token, id_token}=data;
        const {data:profile}=await axios.get('https://www.googleapis.com/oauth2/v1/userinfo',{
            headers:{Authorization: `Bearer ${access_token}`}
        })
        let user=await prisma.user.findFirst({
            where:{
                email:profile.email
            }
        })
        if(!user){
            user=await prisma.user.create({
                data:{
                    name:profile.name,
                    email:profile.email
                }
            })
        }
        const secret:jwt.Secret=process.env.JWT_SECRET !
        const token=jwt.sign({user_id:user.id},secret, { expiresIn: "7d" })
        return res.json({
                success:true,
                token:token
        })
    } catch (error) {
         console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}