import mongoose from "mongoose";

const SignupSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String},
  password: { type: String },
  countryCode:{ type: String },
  phoneNumber:{ type: Number},
  address:{ type: String },
});
export const User = mongoose.model('User', SignupSchema);