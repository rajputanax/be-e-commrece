
import user from '../model/User.js'
import bcrypt from 'bcrypt'
import { genToken }from '../utiles/auth-token.js'


//...............................................................


export const registerUser = async (req, res) => {
    try {
       
        console.log(req.body , 'role----------')
          const isFirstUser = await user.countDocuments() === 0;
       let roleFromClient =   req.body.role ;
       const availableRoles = [ 'buyer' , 'seller'];
       let finalRole ;
       if(isFirstUser){
        finalRole = 'admin'
       }else{
        finalRole = availableRoles.includes(roleFromClient) ? roleFromClient : 'buyer'
       }
    //    console.log(finalRole , 'final')

       const { name, email, password  , role} = req.body;
       console.log(role )

        const salt = await bcrypt.genSalt(10)
        const hashing = await bcrypt.hash(password, salt)
        const users = await user.findOne({ email })
        if (users) {
            res.status(400).json({ msg: 'email already exsist' })
        }

        const register = await user.create(

            {role:finalRole , name, email, password: hashing  }
        )

        if (!name || !email || !password) {
            res.status(400).json({ msg: 'All fields are required' })
        }

        else {
            res.status(200).json({  register  })
        }

    } catch (error) {
        console.error(`got ${error} while register user`)
    }

}



//........................................................

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ msg: 'plz fill all fields!' })
        }
        const users = await user.findOne({ email })
        if (!users) {
            res.status(404).json({ msg: 'user not found!' })
        }
        // ...................................................
        // =========== [ Generate Token ] ===================
       //....................................................
       const tokken = genToken({userId:users._id , role:users.role})


       //....................................................
        // =========== [ Set Token in Coockies ] ============
        //.....................................................
//   app.set('trust proxy', 1);
       res.cookie('tokken', tokken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24*60*60*1000, // 1 day
    path: '/'
});

        // .................................................
        const verifyPwd = await bcrypt.compare(password, users.password)
        if (!verifyPwd) {
            res.status(404).json({ msg: 'Invalid username or password!' })
        }
        if (users && verifyPwd) {
            res.status(200).json({ msg: `user ${users.name} logged in ` })
        }


    } catch (error) {
        console.error(`got this ${error} while login user`)
    }

}


export const logoutUser = (req, res) => {

    res.clearCookie("tokken", {
        httpOnly: true,
        sameSite: "strict",
    });

    return res.status(200).json({ message: "User logged out successfully" });
};

//........................................................
//........................................................
// END //.................................................
//........................................................
//........................................................