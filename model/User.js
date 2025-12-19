import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
       type: String,
            unique: true
        
    },
    password:{
        type:String,
        required:true
    }
    , role:{
          type: String,
        enum : [ 'buyer' , 'seller' , 'admin'],
        default: "user"
    }

}, {timestamps:true})
export default  mongoose.model('user', userSchema);

