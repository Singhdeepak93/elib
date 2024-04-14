import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import fs from 'node:fs';
import bookModel from "./bookModel";

const createBook =async (req: Request,res: Response,next:NextFunction) => {
  const {title,genre} = req.body;
  const files = req.files as {[fieldname: string]: Express.Multer.File[] };

  const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(__dirname,'../../public/data/uploads',fileName );
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder:'book-covers',
    formate: coverImageMimeType,
   });
   
   const bookFileName = files.file[0].filename;
   const bookFilePath = path.resolve(__dirname,'../../public/data/uploads',bookFileName ) 
   const bookFileUploadResult= await cloudinary.uploader.upload(bookFilePath,{
   resource_type:"raw",
   filename_override:bookFileName,
   folder:"book-pdfs",
   format:"pdf",
 });
 console.log("uploadResult",uploadResult);
 console.log("bookFileUploadResult",bookFileUploadResult);


 
    
  //create upload file and url in mongo db  store
 //@ts-ignore
  // console.log('userId', req.userId);

  const newBook = await bookModel.create({
    title,
    genre,
    author:"66182edebb3511e5786236ae",
    coverImage:uploadResult.secure_url,
    file:bookFileUploadResult.secure_url,

  });
  console.log("newBook", newBook);

  //delete the temp file 
  try {
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);
  } catch (error) {
    return next(createHttpError(500,'Error while temp file Delete'))
  }
  

   res.status(201).json({id:newBook._id});
  } catch (error) {
    return next(createHttpError(500,'Error while uploading the file'))
  }
 

   
};

export {createBook};