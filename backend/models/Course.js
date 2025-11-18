import mongoose from "mongoose";
// import { trim } from "validator";

const courseSchema = new mongoose.Schema({
    title:{type: String, required: true, trim:true},
    description: { type: String, required: true},
    category: { type: String, default: "VOCAL"},
    thumbnail: { type: String}, // Course image url
    lessons: [
        {
            title: String,
            videoUrl: String, // cloud Upload Link
            content: String,
            duration: Number,
        },
    ],
    price: { type: Number, default: 0},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref:"User"},
    createdAt: { type: Date, default: Date.now},
});

export default mongoose.model("Course", courseSchema);