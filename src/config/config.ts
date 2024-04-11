import { config as Config} from "dotenv";
Config();

const _config = {
    port : process.env.PORT,
    databaseUrl:process.env.DB_Connection,
    node_env: process.env.NODE_ENV,
    jwtSecret:process.env.JWT_SECRET,
};



export const config = Object.freeze(_config);