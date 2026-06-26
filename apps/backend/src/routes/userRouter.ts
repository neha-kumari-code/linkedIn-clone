import express from 'express'
import { SignUp } from '../auth/signup.js';
import { GoogleLogin } from '../auth/google.js';
import { SignIn } from '../auth/signin.js';

export const router=express.Router();
router.post("/signup",SignUp)
router.post("/signin",SignIn)
router.get("/google",GoogleLogin)

 