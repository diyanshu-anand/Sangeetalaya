// jobs/expireOrders.js
import PaymentOrder from "../models/PaymentOrder.js";

export async function expireOrders() {
  await PaymentOrder.updateMany(
    {
      status: "QR_ISSUED",
      expiresAt: { $lt: new Date() }
    },
    { status: "EXPIRED" }
  );
}
