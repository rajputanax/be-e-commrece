import express from 'express'
import {getCurrentUser} from '../controllers/roleBaseController.js'
// import {} from '../middlewares/registerData.js'

const routerRole = express.Router();

routerRole.route('/users').get(getCurrentUser)


export default routerRole;


//........................................................
//........................................................
// END //.................................................
//........................................................
//........................................................