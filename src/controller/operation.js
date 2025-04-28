import 'dotenv/config'
import mongoose from 'mongoose'
import { operationService } from '../services/service.js';
import bcrypt from 'bcrypt'
import { User } from '../model/userModel.js';
import jsonwebtoken from 'jsonwebtoken';
class Operation {

  //signup
  async signup(req, res) {
    try {
      const body = req.body;
      const {email, password} = req.body;
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6 digit OTP
      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(password, saltRound);
      const refData = {
        ...body,
        password: hashedPassword,
        email
      }
  
      let user = await User.findOne({ email: email });
  
      if (user) {
        if (user.isVerified) {
          return res.status(400).json({ message: "Email already exists and is verified." });
        } else {
          // Save OTP temporarily
          global.tempSignupData = {
            otp,
            id: user._id,
          };
  
          return res.status(200).json({
            status: 200,
            message: "Email is already Exist and OTP Resent Successfully!",
            otp,
          });
        }
      } else {
        const newUser = await User.create(refData);
  
        global.tempSignupData = {
          otp,
          id: newUser._id,
        };
  
        return res.status(200).json({
          status: 200,
          message: "OTP Sent Successfully!",
          otp,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong!" });
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
    }
    const otp = Math.floor(100000 + Math.random() * 900000); 
      
    const tempData = {
      userId: existingUser._id,
      otp,
    };

    global.tempLoginData = tempData; 
    res.status(200).json({
      status: 200,
      message: "OTP sent successfully for login!",
      otp: otp
    });
    }catch (error){
      res.status(500).json({error: "Something went wrong"})
    }
  }
  //otpVerification
  async otpVerification(req, res) {
    try {
      const { otp } = req.body;
  
      if (global.tempSignupData) {
        if (global.tempSignupData.otp != otp) {
          return res.status(400).json({ message: "Invalid OTP for signup." });
        }
        await User.findByIdAndUpdate(global.tempSignupData.id, { isVerified: true }, { new: true });
  
        const token = jsonwebtoken.sign({ userId: global.tempSignupData.id }, 'pranav', {
          expiresIn: '1h',
        });
  
        // Clean temp data
        global.tempSignupData = null;
  
        return res.status(200).json({
          status: 200,
          message: "Signup Successfully!",
          token,
        });
  
      } else if (global.tempLoginData) {
        if (global.tempLoginData.otp != otp) {
          return res.status(400).json({ message: "Invalid OTP for login." });
        }
  
        const token = jsonwebtoken.sign({ userId: global.tempLoginData.userId }, 'pranav', {
          expiresIn: '1h',
        });
  
        global.tempLoginData = null;
  
        return res.status(200).json({
          status: 200,
          message: "Login Successfully!",
          token,
        });
  
      } else {
        return res.status(400).json({ message: "OTP is Expired." });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
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