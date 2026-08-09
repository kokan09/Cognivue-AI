import jwt from "jsonwebtoken";
import config from "../config/config.js"
import userModel from "../models/user.model.js";

/**
 * @route POST /api/auth/sign-up
 * @param {full-name, email, password} req.body 
 * @returns {json}
 */
export async function authControllerRegister(req, res){
    const { full_name, email, password, role, DOB, sex } = req.body;
    
    const userExists = await userModel.findOne({ email : email });

    if(userExists) return res.status(400).json({
        success : false,
        message : "User Already Exist's please sign-in",
        error : "User Exist's with this email"
    })

    const user = await userModel.create({ full_name, email, password, role, sex, DOB });

    const token = await jwt.sign({id : user._id}, config.JWT_SECRET);

    res.cookie("auth_token", token, {
        maxAge: 24 * 60 * 60 * 1000, // Expires in 24 hours (in milliseconds)
        httpOnly: true,              // Blocks client-side JS access
        secure: true,                // Requires HTTPS
        sameSite: 'lax',             // CSRF protection balance
        path: '/'                    // Valid for all paths
    });

    res.status(201).json({
        success : true,
        user : {
            full_name : user.full_name,
            email : user.email,
            role : user.role
        }
    });
}