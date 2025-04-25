import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ Database Connected Successfully!");
  } catch (error) {
      console.error("❌ Database Connection Failed:", error);
  }
};

export default ConnectDB