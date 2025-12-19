// ---------------------------------------------------------

import {decodeToken} from '../utiles/auth-token.js'

// -----------auth-middleware for protected routes------------------

export const authMiddleware = (req , res , next) => {
    const { tokken } = req.cookies;
if(!tokken){
    res.status(401).json({msg :"unauthorized user"})
}
try{
 const {userId,role} = decodeToken(tokken);
 const exploreUser = userId === '68e375015f0d9314db10283c'
  req.users = {userId ,role , exploreUser}
   console.log('authmiddleware__tokken ' ,req.users )
   next()
}catch(err){
console.log(`the error --- ${err} is tracked by  auth middleware`)
}
}



// ---------------------------------------------------------