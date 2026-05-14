// utils/invoice.js
import PDFDocument from "pdfkit";
import fs from "fs";

export function generateInvoice(order, user, course) {
  const doc = new PDFDocument();
  const filePath = `invoices/invoice_${order._id}.pdf`;

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("SANGEETALAYA INVOICE", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Invoice ID: ${order._id}`);
  doc.text(`User: ${user.name}`);
  doc.text(`Course: ${course.title}`);
  doc.text(`Amount: ₹${order.amount}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.end();
  return filePath;
}
