import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";


const createUser = async (req: Request,res: Response,next:NextFunction) =>{

    const {name,email,password} = req.body;
    //validation 
    //u can use express validater
    if(!name || !email || !password){
        const error = createHttpError(404, "All field are requied");
        return next(error);
    }


    res.json({message:"User Created sucessfully"});
}

export  {createUser};