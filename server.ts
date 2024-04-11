import { config } from "./src/config/config";
import app from "./src/app";
import connectDB from "./src/config/db";


const startServer = async () =>{
    //connect database
  await  connectDB();
    const port = config.port || 9090;

    app.listen(port ,() =>{
        console.log(`Listing on port: ${port}`);
    })
};

startServer();