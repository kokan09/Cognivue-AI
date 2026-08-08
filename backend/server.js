import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/db.js";

connectDB();

app.listen(config.Port, () => {console.log(`Server is Running at ${config.Port}`)});