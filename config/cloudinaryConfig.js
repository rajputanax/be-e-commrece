import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { v2 as cloudinary } from "cloudinary";
import pkg from 'multer-storage-cloudinary';

// This is the crucial fix for the "not a constructor" error:
const CloudinaryStorage = pkg.CloudinaryStorage || pkg.default?.CloudinaryStorage || pkg;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET 
});

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'upload',
        allowed_formats: ['png', 'jpg', 'jpeg', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }]
    }
});

export default cloudinary;