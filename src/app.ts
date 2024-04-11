import express from 'express';
import createHttpError from 'http-errors';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import  userRouter  from './user/userRouter';


const app = express();
app.use(express.json());

//Router
app.get(`/`,(req,res,next)=>{
    res.json({message:"Server will start"});
   
})

app.use('/api/users', userRouter);




//Global error handlers
app.use(globalErrorHandler);

export default app;