import mongoose from "mongoose";
import config from "./config.js";

function connectDB(){
    mongoose.connect(config.mongo_url)
    .then(() => console.log("MongoDB connected Successfully"))
    .catch(error => console.log(error));
}


export default connectDB;