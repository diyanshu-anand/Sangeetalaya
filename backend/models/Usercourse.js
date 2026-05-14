// models/UserCourse.js
import mongoose from "mongoose";

const userCourseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },
  grantedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("UserCourse", userCourseSchema);
