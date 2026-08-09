import express from "express";
import morgan from "morgan";
import config from "./config/config.js";
import cookieParser from "cookie-parser";

//Routes
import authRouter from "./routes/auth.route.js";


const app = express();

//Middleware
app.use(express.json());
app.use(cookieParser());

if(config.NODE_ENVIRONMENT === "Production") app.use(morgan("combined"))
else app.use(morgan("dev"));

//Routes
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message : "Welcome to Cognivue Backend",
        time : new Date()
    });
});

export default app;