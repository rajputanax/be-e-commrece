import express from 'express'
import { applicationStats } from '../controllers/adminController.js';
import {admin} from '../middlewares/adminDB.js'
const router =  express.Router();


router.get('/stats', [admin('admin'),applicationStats])


export default router