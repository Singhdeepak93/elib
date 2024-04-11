import express from 'express';
import createHttpError from 'http-errors';
import { globalErrorHandler } from './middlewares/globalErrorHandler';


const app = express();

//Router
app.get(`/`,(req,res,next)=>{
    const error = createHttpError(400,"something went wrong")
    throw error;
    res.json({message:"Server will start"});
   
})




//Global error handlers
app.use(globalErrorHandler);

export default app;