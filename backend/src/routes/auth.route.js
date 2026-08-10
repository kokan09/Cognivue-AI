import express from "express";
import {authControllerRegister, authControllerLogin} from "../controllers/auth.controller.js";
import {authValidateSignUp, authValidateSignIn} from "../validator/auth.validator.js";

const authRouter = express.Router();

authRouter.post("/sign-up", authValidateSignUp, authControllerRegister);
authRouter.post("/sign-in", authValidateSignIn, authControllerLogin);

export default authRouter;