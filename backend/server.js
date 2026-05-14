import "./env.js";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import router from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import paymentrouter from "./routes/payments.js";

dotenv.config();

const app = express();


// Middleware
app.use(express.json({ limit: "10mb" }));

app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://your-frontend-name.onrender.com"
    ],
    credentials: true
}));


// Health Route
app.get("/", (req, res) => {
    res.send("Ecosystem being prepared");
});


// Routes
app.use("/api/auth", router);
app.use("/api/courses", courseRoutes);
app.use("/api/payments", paymentrouter);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});