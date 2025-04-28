import express from "express";
import { operation } from "../controller/operation.js";
const route = express.Router();
import * as validation from "../validation/index.js"
import { errorResponse } from "../middleware.js/validation.js";
import { VerifyToken } from "../middleware.js/authMiddleware.js";

route.get("/sign-up",validation.user.signupValidation,errorResponse,operation.signup);

route.post("/login",validation.user.loginValidation,errorResponse, operation.login);
route.post("/otp-verification", operation.otpVerification);


route.get("/userList",VerifyToken, operation.userList);

route.get("/getUserId/:id", operation.getUserId);

export default route;