import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Invalid Email"],
    },
    passwordHash: {type: String, required: true},
    resetPasswordToken: { type: String}, //Forgot Password changes
    resetPasswordExpire: { type: Date}, // Forgot Password modifications
    createdAt: { type: Date, default: Date.now},
});


export default mongoose.model("User", userSchema);