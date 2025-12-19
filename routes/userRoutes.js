import express from 'express'
import {loginUser,registerUser,logoutUser} from "../controllers/userControllers.js"
import {dataValidation} from '../middlewares/registerData.js'
import user from '../model/User.js'

const router = express.Router();

router.route('/login').post(loginUser)
router.route('/register').post( dataValidation, registerUser);
router.route('/logout').post(logoutUser)
router.route('/roles').get( (req , res)=>{
    try {
    
    const roles = user.schema.path("role").enumValues;

   console.log(roles)
    res.status(200).json(roles , '----');
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ msg: "Server error" });
  }
})

export default router;