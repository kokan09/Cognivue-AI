import express from "express";
import morgan from "morgan";
import config from "./config/config.js";

const app = express();

//Middleware
app.use(express.json());
if(config.NODE_ENVIRONMENT === "Production") app.use(morgan("combined"))
else app.use(morgan("dev"));


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message : "Welcome to Cognivue Backend",
        time : new Date()
    });
});

export default app;