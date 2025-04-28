import { body } from "express-validator";
import { User } from "../model/userModel.js";

export const signupValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("User name is required"),
  
  body("email")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async(value) => {
      const find = await User.findOne({email:value})
      if(find.isVerified){
        throw new Error("Email already Exist");
      }
    }),
  
    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")  
    .matches(/^(?=[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/)
    .withMessage("Password should start with a capital letter, include lowercase,one number and one special character")
     
]

export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async(value) => {
      const find = await User.findOne({email:value})
      if(!find){
        throw new Error("Email Not Exist");
      }
    }),
  
    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")  
    .matches(/^(?=[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/)
    .withMessage("Password should start with a capital letter, include lowercase,one number and one special character")
]