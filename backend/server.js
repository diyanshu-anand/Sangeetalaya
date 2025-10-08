import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

//Middleware setup
app.use(express.json());
app.use(cors());

//Routes initialization
app.get("/", (req, res)=>{
    res.send("Ecosystem being preapared");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(()=> console.log("mONGOdb cONNECTED")).catch(err => console.log(err));

//Server
const PORT = process.env.PORT|| 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


