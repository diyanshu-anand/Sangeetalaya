import mongoose from "mongoose";

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;


//Not using it just keeping in chance i might need while scaling it.