import 'dotenv/config'
import mongoose from 'mongoose'
import { operationService } from '../services/service.js';
import bcrypt from 'bcrypt'
import { User } from '../model/userModel.js';
import jsonwebtoken from 'jsonwebtoken';
class Operation {

  //signup
  async signup(req, res) {
   
    try{
      const body = req.body
      const {password} = req.body;
      const saltRound = 10;
      
      const hashedPassword  = await bcrypt.hash(password, saltRound)
      
      const refData={
        ...body,
        password:hashedPassword,
        
      }
     
      const otp=()=>{
        return 123456
      }
     await operationService.signup(refData)
    // const otprefData={
    //   userId:data._id,
    //   otp:otp
    // }

    // await operationService.
      
      const token = jsonwebtoken.sign({ userId: refData._id }, 'pranav', {
        expiresIn: '1h',
        });
       
      res.status(200).json({
        status: 200,
        message: "Signup Successfully!",
        token
      });
    } catch (error){
      res.status(500).json({ error: "Something went wrong!"})
    }
  }

  //login
  async login(req, res){
    
    try{
      
        const {email,password} = req.body;    
    const existingUser = await User.findOne({email:email});
   
    const camparePassword=await bcrypt.compare(password,existingUser.password)
    
    if(!camparePassword){
      res.status(401).json({message:"Password is Invalid"});
    }else{
      
      const token = jsonwebtoken.sign({ userId: existingUser._id }, 'pranav', {
        expiresIn: '1h',
        });
       
       
      res.status(200).json({message:"Login Successfully!",token})
    }

    }catch (error){
      res.status(500).json({error: "Something went wrong"})
    }
  }

  //userList
  async userList(req, res) {
     try{
         
          const data = await operationService.userList({});
          res.status(200).json({
            status: 200,
            message: "Data Fetch Successfully!",
            data:data
          });

     }catch (error){
      res.status(500).json({error: "Something went wrong"})
    }
  }
  //UserDetail
  async getUserId(req, res) {
    try {
      const id = req.params.id;
      const data = await operationService.userList({ _id: new mongoose.Types.ObjectId(id) })
      res.status(200).json({
        status: 200,
        data: data,
      });
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}
 


export const operation = new Operation();