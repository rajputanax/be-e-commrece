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

