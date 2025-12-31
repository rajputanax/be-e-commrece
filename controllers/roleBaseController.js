import user from '../model/User.js'


export const getCurrentUser = async (req , res) => {
    try {
        const currentUser = await user.findOne({_id:req.users.userId}) 
        
        res.status(200).json({msg : 'current user' , currentUser})
    } catch (error) {
        console.log(`got ${error} while getting current user`)
    }

}




//........................................................
//........................................................
// END //.................................................
//........................................................
//........................................................