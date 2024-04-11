import mongoose from 'mongoose';
import { config } from './config';



const connectDB = async () =>{
 
   try {

     mongoose.connection.on('connected',()=>{
          console.log('Connected to database successfully')
    })

    mongoose.connection.on('error',(error)=>{
       console.log("Error in connection to database", error)
    });
       await  mongoose.connect(config.databaseUrl as string);

      
   } catch (error) {
     console.error("Failed to connect", error);
     setTimeout(()=>{
          process.exit(1);
     },1000);
   }
}
export default connectDB;