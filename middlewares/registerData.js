import { body, validationResult ,param} from "express-validator";
import user from '../model/User.js'
import Product from '../model/Product.js'
// .....................................................................................
const checkInputData = (validation) => {
    return [
        validation, (req, res, next) => {
            const errors = validationResult(req);
            // console.log(errors)
            if (!errors.isEmpty()) {
                const errMsg = errors.array().map((err) => { return err.msg })
                return res.status(400).json({ validationMessage: errMsg });
                // or throw new Error(errMsg);
            }
            next();
        }
    ]
}


export const dataValidation = checkInputData(
    [body('name').notEmpty().withMessage('name is required'),
    body('email').notEmpty().withMessage('email is required')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        // .withMessage('Invalid email format')
        .custom(async (email) => {
            
            const existingUser = await user.findOne({ email });
            if (existingUser) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    body('password')
        .notEmpty()
        .withMessage('password should not be empty')
        .isLength({ min: 8 })
        .withMessage('password should have at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    ]
);



//........................................................
//........................................................
// END //.................................................
//........................................................
//........................................................