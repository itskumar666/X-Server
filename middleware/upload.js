import { v2 as cloudinary } from 'cloudinary';
// import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => `users/${req.body.username}`, // Save files in a user-specific folder
    public_id: (req, file) => Date.now().toString(), // Optional - specify file name
  },
});

const upload = multer({ storage });



