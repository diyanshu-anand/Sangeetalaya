import express from "express";
import PaymentOrder from "../models/PaymentOrder.js";
import Course from "../models/Course.js";
import { encryptPayload, verifyHmac } from "../utils/crypto.js";
import { generateQR } from "../utils/qr.js";
import { protect } from "../middleware/auth.js";
import Usercourse from "../models/Usercourse.js";

const paymentrouter = express.Router();

/* ===============================
   CREATE PAYMENT ORDER
================================ */
paymentrouter.post("/create-order", protect, async (req, res) => {
  try {
    const { courseId, paymentMode } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const order = await PaymentOrder.create({
      userId: req.user.id,
      courseId,
      amount: course.price,
      paymentMode,
      expiresAt:
        paymentMode === "QR"
          ? new Date(Date.now() + 5 * 60 * 1000)
          : null
    });

    let qrImage = null;

    if (paymentMode === "QR") {
      const plainPayload = {
        orderId: order._id.toString(),
        amount: order.amount,
        expiresAt: order.expiresAt
      };

      const encryptedPayload = encryptPayload(plainPayload);

      // MUST BE STRING
      const qrString = JSON.stringify(encryptedPayload);

      qrImage = await generateQR(qrString);

      console.log("QR STRING:", qrString);

      order.status = "QR_ISSUED";
      await order.save();
    }

    res.status(201).json({
      orderId: order._id,
      amount: order.amount,
      paymentMode,
      qrImage,
      expiresAt: order.expiresAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment order creation failed" });
  }
});


/* ===============================
   MANUAL PAYMENT SUBMIT
================================ */
paymentrouter.post("/manual-submit", protect, async (req, res) => {
  const { orderId, txnId } = req.body;

  const order = await PaymentOrder.findById(orderId);

  if (!order || order.paymentMode !== "MANUAL") {
    return res.status(400).json({ error: "Invalid order" });
  }

  order.txnId = txnId;
  order.status = "PENDING_REVIEW";
  await order.save();

  res.json({ message: "Payment submitted for admin review" });
});

/* ===============================
   ADMIN GRANT ACCESS
================================ */
paymentrouter.post("/admin/grant-access", async (req, res) => {
  const { orderId } = req.body;

  const order = await PaymentOrder.findById(orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  order.status = "VERIFIED";
  await order.save();

  await Usercourse.create({
    userId: order.userId,
    courseId: order.courseId
  });

  res.json({ message: "Course access granted" });
});

/* ===============================
   VERIFY QR PAYMENT
================================ */
paymentrouter.post("/verify", async (req, res) => {
  const { orderId, encrypted, hmac } = req.body;

  const order = await PaymentOrder.findById(orderId);
  if (!order) return res.status(404).json({ error: "Invalid order" });

  if (order.status !== "QR_ISSUED") {
    return res.status(400).json({ error: "Order not active" });
  }

  if (!verifyHmac(encrypted, hmac)) {
    return res.status(403).json({ error: "Tampered payload" });
  }

  if (order.expiresAt < new Date()) {
    order.status = "EXPIRED";
    await order.save();
    return res.status(400).json({ error: "QR expired" });
  }

  order.status = "PAID";
  await order.save();

  await Usercourse.create({
    userId: order.userId,
    courseId: order.courseId
  });

  res.json({ message: "Payment verified & course unlocked" });
});

/* ===============================
   COURSE ACCESS CHECK
================================ */
paymentrouter.get("/access/:courseId", protect, async (req, res) => {
  const access = await Usercourse.findOne({
    userId: req.user.id,
    courseId: req.params.courseId
  });

  res.json({ hasAccess: !!access });
});

export default paymentrouter;
