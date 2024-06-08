import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import cors from 'cors'
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
// import userRoutes from "./routes/userRoutes.js"
import controller from "./controller/userController.js"
import nodemailer from "nodemailer"
import crypto from "crypto"
import User from "./models/userSchema.js";




const app=express();
const PORT = process.env.PORT || 9001;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
app.use(express.json());
app.use(express.urlencoded());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "100mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(morgan("common"));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// importing the db connection from db file
import("./config/db.js")


          



const storage=multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,'/uploads')
    },
    filename: function(req,file,cb){
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const upload=multer({storage})





// user auth endpoints
app.use("/api/register",upload.single('profileimage') ,controller.registerUser);

  
app.get('/api/verify-email', async (req, res) => {
    const token = req.query.token;
  
    try {
      const user = await User.findOne({ verificationToken: token });
      if (!user) {
        return res.status(400).json({ message: 'Invalid verification token' });
      }
  
      user.verified = true;
      user.verificationToken = undefined; // Remove token after verification
      await user.save();
  
      res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error verifying email' });
    }
  });
  
app.get("/",(req,res)=>{
    res.send("This is homepage for twitter");
})

app.listen(process.env.PORT,()=>{
    console.log("The server is running on ");
  })