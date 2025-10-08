import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { validateSignupInput, validateLoginInput } from "../utils/validators";
import { authLimiter } from "../middleware/ratelimiter";

const router = express.Router();

//signup area

router.post("/signup", authLimiter, async (req, res) => {
    try{
        const {name, email, password} = req.body
    }
})