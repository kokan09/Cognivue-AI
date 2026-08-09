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
    body("full_name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().isEmail().withMessage("Email is required"),
    body("password").notEmpty().isLength({ min : 6 }).withMessage("Password is required"),

    validateRequest
]

