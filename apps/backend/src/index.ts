import express from 'express'
import cors from 'cors';
import { router } from './routes/userRouter.js';
import dotenv from "dotenv"
dotenv.config()

const port =process.env.PORT || 3000
const app=express();

app.use(cors())
app.use(express.json())
app.use("/api/v1/user",router)
console.log(port)
app.listen(port,()=>{
    console.log(`app started ${port}`)
})