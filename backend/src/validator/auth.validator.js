import {body, validationResult} from "express-validator";

export function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            message: "Validation errors",
            errors: errors
        });
    }

    next();
}

export const authValidateSignUp = [
    body("full_name").notEmpty().trim().withMessage("Name is required"),
    body("email").notEmpty().trim().isEmail().withMessage("Email is required"),
    body("password").notEmpty().trim().isLength({ min : 6 }).withMessage("Password is required"),
    body("sex").trim().toLowerCase().isIn(['male', 'female', 'non-binary', 'perfer not to say'])
    .withMessage("sex must be male or female"),
    body("DOB").optional().isDate({ format: 'YYYY-MM-DD', strictMode: true }) 
    .withMessage('Date of birth must be a valid date in YYYY-MM-DD format'),

    validateRequest
]
export const authValidateSignIn = [
    body("email").notEmpty().trim().isEmail().withMessage("Email is required"),
    body("password").notEmpty().trim().isLength({ min : 6 }).withMessage("Password is required"),
    validateRequest
]

