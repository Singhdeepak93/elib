import express from 'express';
import createHttpError from 'http-errors';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import  userRouter  from './user/userRouter';
import bookRouter from './book/bookRouter';


const app = express();
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