import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["apparel", "food and beverages", "health and beauty", "electronics", "sporting goods"],
        default: "apparel"
    },
    stock: {
        type: Number,
        required: true
    },
    image: [String]
    , createdBy: {
        type: mongoose.Schema.Types.ObjectId,
         ref : 'user'
    }

})

export default mongoose.model('Product', productSchema)

//........................................................
//........................................................
// END //.................................................
//........................................................
//........................................................
