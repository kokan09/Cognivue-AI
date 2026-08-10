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
        message : "Successfull Register a user",
        user : {
            full_name : user.full_name,
            email : user.email,
            gender : user.sex,
            DOB : user.DOB,
            role : user.role
        }
    });
}

export async function authControllerLogin(req, res){
    const {email, password} = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if(!user) return res.status(400).json({
        success : false, 
        message : "Invalid Credentials",
        error : "User with this email does not exist"
    })

    const isValid = await user.comparePassword(password);

    if(!isValid) return res.status(400).json({
        success: false,
        message : "Invalid Credentials",
        error : "Incorrect Password"
    })

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
        message : "Logined-in Successfull",
        user : {
            full_name : user.full_name,
            email : user.email,
            gender : user.sex,
            DOB : user.DOB,
            role : user.role
        }
    })
}