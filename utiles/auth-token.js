import jwt from  'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config()


export const  genToken = (payload)=>{
    const tokken =jwt.sign(payload , process.env.SECRETE_KEY , {
        expiresIn : '1d'
    })
    return tokken;
}

export const  decodeToken = (tokken)=>{
    const decode = jwt.verify(tokken , process.env.SECRETE_KEY  )
    return decode ;
}


//........................................................
//........................................................
// END //.................................................
//........................................................
//........................................................