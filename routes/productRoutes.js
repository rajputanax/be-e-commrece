import express from 'express'
import { getAllProducts, getSingleProduct, createProduct } from '../controllers/productController.js';
import {roleBaseControl} from '../middlewares/roleBaseAcessControl.js'
import upload from "../middlewares/uploadMiddleware.js";

const router =  express.Router();


router.get('/all-products', getAllProducts)
router.get('/product/:id', getSingleProduct)
router.post('/add-product', roleBaseControl ,  upload.array("images", 5) , createProduct)

export default router


//........................................................
//........................................................
// END //.................................................
//........................................................
//........................................................