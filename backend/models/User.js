import mongoose from "mongoose";
import validator, { trim } from "validator";

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
    createdAt: { type: Date, default: Date.now},
});


export default mongoose.model("User", userSchema);