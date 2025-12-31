import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// import path from 'path'

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRETE
})

export const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'upload',
        allowed_formats:['png','jpg','jpeg','webp'],
       transformation:[{width:800,height:800,crop:'limit'}]
    }
})

export default cloudinary



//........................................................
//........................................................
// END //.................................................
//........................................................
//........................................................