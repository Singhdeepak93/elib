import express from 'express';
import createHttpError from 'http-errors';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import  userRouter  from './user/userRouter';
import bookRouter from './book/bookRouter';
import { config } from './config/config';


const app = express();
app.use(cors({
    origin: config.frontentDomain
}));
app.use(express.json());


//Router
app.get(`/`,(req,res,next)=>{
    res.json({message:"Server will start"});
   
})

app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);




//Global error handlers
app.use(globalErrorHandler);

export default app;