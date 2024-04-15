import { config as Config} from "dotenv";
Config();

const _config = {
    port : process.env.PORT,
    databaseUrl:process.env.DB_Connection,
    node_env: process.env.NODE_ENV,
    jwtSecret:process.env.JWT_SECRET,
    cloudinaryCloud:process.env.CLOUDINARY_CLOUD, 
    cloudinaryApikey:process.env.CLOUDINARY_API_KEY, 
    cloudinarySecret:process.env.CLOUDINARY_API_SECRET, 
    frontentDomain:process.env.FRONTENT_DOMAIN

};



export const config = Object.freeze(_config);