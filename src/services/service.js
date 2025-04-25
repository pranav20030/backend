import { User } from "../model/userModel.js";

class OperationService{

  async signup(payload){
   try{
    const data=  await User.create(payload);
    return data;
   } catch (error) {
     throw error;
   }
  }
  async userList(payload){
    try{
      return User.aggregate([
        {
            $match:payload
        }
    ])
    } catch (error) {
      throw error;
    }
  }
}
export const operationService = new OperationService();