dotenv.config();
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import user from './model/User.js'
import { promises as fs } from 'fs';
import Product from './model/Product.js';



try {
    await mongoose.connect(process.env.MONGO_DB_URI)
    // const users = await user.findOne({ email: 'visitor@gmail.com' })
    const products = JSON.parse(await fs.readFile(new URL('./utiles/productData.json', import.meta.url)))
    const allProducts = products.map((x) => {
        return { ...x}
    })
    await Product.deleteMany()
    await Product.create(allProducts);
    console.log('success!!!')
    process.exit(0)
} catch (error) {
    console.log(error)
    process.exit(1)
};