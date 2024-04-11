import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModal from "./userModal";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";


const createUser = async (req: Request,res: Response,next:NextFunction) =>{

    const {name,email,password} = req.body;
    //validation 
    //u can use express validater
    if(!name || !email || !password){
        const error = createHttpError(400, "All field are requied");
        return next(error);
    }
    //Database call
    try {
        const user = await userModal.findOne({email});
    if(user){
        const error = createHttpError(400,"user already exits");
        return next(error);
    }
    } catch (error) {
        return next(createHttpError(500,"Error will getting user"));
    }


    
    //bcrypt hash
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser : User;
    try {
       newUser = await userModal.create({
        name, email, password: hashedPassword
    }); 
    } catch (error) {
        return next(createHttpError(500,"Error will getting user"));
    }
   

    //token generation
    try {
        const token = sign({sub:newUser._id}, config.jwtSecret as string, {expiresIn: '7d'});
          res.json({accessToken: token});
        
    } catch (error) {
        return next(createHttpError(500,"Error while singin jwtToken")); 
    }
  
}

export  {createUser};