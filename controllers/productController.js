import Product from '../model/Product.js'
import cloudinary from 'cloudinary';
export const getAllProducts = async (req, res) => {

    try {
        const total = await Product.countDocuments();
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const products = await Product.find(
            req.users.role === "admin" 
    ? {} 
    : { createdBy: req.users.userId }
        ).skip(skip).limit(limit);

        console.log(total, 'total')
        res.status(200).json({
            message: "Fetched all products successfully",
            total,
            page,
            limit,
            products,
        });
    } catch (error) {
        throw error
    }

}

export const getSingleProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const findProduct = await Product.findOne({ _id: id });
        res.status(200).json({ message: "Product get successfully", product: findProduct })
    } catch (error) {
        throw error
    }
}


export const createProduct = async (req, res) => {
    try {
    console.log(req.body)
    console.log(req.file)
     req.body.createdBy = req.users.userId
        const {createdBy ,name , description ,   price ,    category , stock } = req.body
 let imageUrls = [];
    if (req.files) {
      imageUrls = req.files.map(file => file.path); 
    }
        const product = await Product.create({name , description ,   price ,    category , stock  , image:imageUrls , createdBy})
        res.status(200).json({ message: "Product created successfully", product })
    } catch (error) {
        console.log(error)
    }
}


//........................................................
//........................................................
// END //.................................................
//........................................................
//........................................................