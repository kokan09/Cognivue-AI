import express from "express";
import morgan from "morgan";
import config from "./config/config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import scraperRouter from "./routes/scraper.route.js";

//Routes
import authRouter from "./routes/auth.route.js";

const app = express();

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true            
}));

if(config.NODE_ENVIRONMENT === "Production") app.use(morgan("combined"))
else app.use(morgan("dev"));

//Routes
app.use("/api/auth", authRouter);
app.use("/api/scraper", scraperRouter);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message : "Welcome to Cognivue Backend",
        time : new Date()
    });
});

export default app;