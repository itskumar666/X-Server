import bcrypt from "bcrypt";
import User from "../models/userSchema.js";
import cloudinary from "../config/cloudinaryconfig.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer"
dotenv.config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shivamdubeyfd@gmail.com', 
    pass: 'qyng dipp kbje jgvu'   
  }
});
const userController = {

  registerUser: async (req, res) => {
    try {
      const { name,username, email,password } = req.body;

      // Generate verification token (replace with a secure token generation method)
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);



    
      const newUser = new User({ name:name, email:email, dateOfBirth:birthday, verificationToken: token });
      try {
        await newUser.save();
    
        // Send verification email
        const mailOptions = {
          from: '"twitter" <shivamdubeyfd@gmai.com>',
          to: email,
          subject: 'Verify Your Email Address for twitter',
          html: `
            Hi ${name},
            Thank you for registering with tiwtter!
            To activate your account, please click on the verification link below:
            <a href="http://localhost:9000/api/verify-email?token=${token}">Verify Email</a>
          `,
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error sending verification email' });
          }
          console.log('Verification email sent:', info.response);
          res.status(200).json({ message: 'Please check your email for verification link' });
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user' });
      }

     

    
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },
  userLogin: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username:username });
      console.log(user)
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      if (!password==user.password) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  // change secret key ***
      const token = jwt.sign({ userId: username },"shivam");
      // res.status(200).json({ token });
      console.log(token)
      res.cookie('token', token).json({ message: "Login successful" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  
  }}


export default userController;
