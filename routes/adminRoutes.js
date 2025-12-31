import express from 'express'
import { applicationStats  , adminDashboardStats} from '../controllers/adminController.js';
// import {admin} from '../middlewares/adminDB.js'
const router =  express.Router();


router.get('/stats', [
    // admin('admin')
    ,applicationStats])
router.get('/admin-dashboard', adminDashboardStats)


export default router



//........................................................
//........................................................
// END //.................................................
//........................................................
//........................................................