import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    items:{
        productId:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        quantity:Number,
    },
})

export default mongoose.model('Cart' , cartSchema)