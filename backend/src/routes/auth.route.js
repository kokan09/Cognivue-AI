import express from "express";
import {authControllerRegister} from "../controllers/auth.controller.js";
import {authValidateSignUp} from "../validator/auth.validator.js";

const authRouter = express.Router();

authRouter.post("/sign-up", authValidateSignUp, authControllerRegister);

export default authRouter;