// models/PaymentOrder.js
import mongoose from "mongoose";

const paymentOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: "INR"
  },

  status: {
    type: String,
    enum: [
      "CREATED",
      "QR_ISSUED",
      "PAID",
      "PENDING_REVIEW",
      "VERIFIED",
      "REJECTED",
      "EXPIRED"
    ],
    default: "CREATED"
  },

  paymentMode: {
    type: String,
    enum: ["QR", "MANUAL"],
    required: true
  },

  txnId: {
    type: String,
    default: null
  },

  expiresAt: {
    type: Date
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("PaymentOrder", paymentOrderSchema);
