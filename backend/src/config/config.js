import dotenv from "dotenv";

dotenv.config();

if(!process.env.PORT) console.error("PORT is not defined in environment varible");
if(!process.env.NODE_ENVIRONMENT) console.error("NODE_ENVIRONMENT is not defined in environment varible")
if(!process.env.MONGO_DB) console.error("MONGO_DB is not defined in environment varible")

const config = { 
    Port : process.env.PORT,
    NODE_ENVIRONMENT : process.env.NODE_ENVIRONMENT,
    mongo_url : process.env.MONGO_DB,
}

export default config;