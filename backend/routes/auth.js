// routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { validateSignupInput, validateLoginInput } from "../utils/validators.js";
import { authLimiter } from "../middleware/ratelimiter.js";
import { generateResetToken } from "../utils/generators.js";

const router = express.Router();

// ==========================
//  SIGNUP ROUTE
// ==========================
router.post("/signup", authLimiter, async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validate input
        const { isValid, errors } = validateSignupInput({ name, email, password });
        if (!isValid) return res.status(400).json({ errors });

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Save user
        const user = new User({ name, email, passwordHash });
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "Signup successful",
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during signup" });
    }
});

// ==========================
//  LOGIN ROUTE
// ==========================
router.post("/login", authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        const { isValid, errors } = validateLoginInput({ email, password });
        if (!isValid) return res.status(400).json({ errors });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during login" });
    }
});

// ==========================
//  FORGOT PASSWORD
// ==========================
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "No user found with that email" });
        }

        const { resetToken, hashedToken } = generateResetToken();

        // Save token to DB
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // For now, just return the reset link (in production, send email)
        const resetURL = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;
        res.status(200).json({
            message: "Password reset link generated",
            resetURL,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during forgot password" });
    }
});

// ==========================
//  RESET PASSWORD
// ==========================
router.post("/reset-password/:token", async (req, res) => {
    try {
        const resetToken = req.params.token;
        const { newPassword } = req.body;

        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }, // not expired
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during password reset" });
    }
});

export default router;
