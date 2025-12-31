import Product from '../model/Product.js'
import user from '../model/User.js'


export const applicationStats = async (req, res) => {

    try {

        const [totalProducts, totalUsers] = await Promise.all(
            [
                Product.countDocuments(),
                user.countDocuments()
            ]
        )
        res.status(200).json(
            {
                success: true, data: {
                    totalProducts, totalUsers
                }
            }
        )

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                msg: 'nothing founds',
                error: error
            }
        )
    }


}
export const adminDashboardStats = async (req, res) => {
  try {
    const [userStats, productStats, sellerProducts] = await Promise.all([

      user.aggregate([
        { $match: { role: "seller" } },
        { $count: "totalSellers" }
      ]),

      Product.aggregate([
        { $count: "totalProducts" }
      ]),

      
      Product.aggregate([
        {
          $lookup: {
            from: "users",            
            localField: "createdBy",  
            foreignField: "_id",
            as: "seller"
          }
        },
        { $unwind: "$seller" },
        {
          $group: {
            _id: "$seller._id",
            sellerName: { $first: "$seller.name" },
            sellerEmail: { $first: "$seller.email" },
            products: {
              $push: {
                _id: "$_id",
                name: "$name",
                price: "$price"
              }
            },
            totalProducts: { $sum: 1 }
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSellers: userStats[0]?.totalSellers || 0,
        totalProducts: productStats[0]?.totalProducts || 0,
        sellerProducts
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "nothing found",
      error
    });
  }
};



//........................................................
//........................................................
// END //.................................................
//........................................................
//........................................................