import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import fs from 'node:fs';
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  // 'application/pdf'
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );
    const _req = req as AuthRequest;

    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    // Delete temp.files
     try {
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(bookFilePath);
     } catch (error) {
      return next(createHttpError(500,'Delete Temp. file failed'));
     }
  

    res.status(201).json({ id: newBook._id });
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "Error while uploading the files."));
  }
};


const updateBook = async(req: Request,res: Response,next:NextFunction) =>{
  const {title,genre} = req.body;
   const bookId = req.params.bookId;

   const book = await bookModel.findOne({ _id: bookId});
   if(!book){
    return next(createHttpError(404,"Book not found"));
   }

   //check the files is exits
   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
   let completeCoverImage = "";
   if (files.coverImage) {
     const filename = files.coverImage[0].filename;
     const converMimeType = files.coverImage[0].mimetype.split("/").at(-1);
     // send files to cloudinary
     const filePath = path.resolve(
       __dirname,
       "../../public/data/uploads/" + filename
     );
     completeCoverImage = filename;
     const uploadResult = await cloudinary.uploader.upload(filePath, {
       filename_override: completeCoverImage,
       folder: "book-covers",
       format: converMimeType,
     });
 
     completeCoverImage = uploadResult.secure_url;
     await fs.promises.unlink(filePath);
   }

   // check if file field is exists.
  let completeFileName = "";
  if (files.file) {
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads/" + files.file[0].filename
    );

    const bookFileName = files.file[0].filename;
    completeFileName = bookFileName;

    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: completeFileName,
      folder: "book-pdfs",
      format: "pdf",
    });

    completeFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    { new: true }
  );

  res.json(updatedBook);
};

const AllBookList = async(req: Request,res: Response,next:NextFunction)=>{

  try {
    const AllList = await bookModel.find();
    res.json(AllList);
  } catch (error) {
    return next(createHttpError(500, "Error while getting AllBookList"));
  }

};

const SingleBookList = async(req: Request,res: Response,next:NextFunction)=>{

  try {
    const bookId= req.params.bookId;
    const SingleList = await bookModel.findOne({_id:bookId});
    if(!SingleList){
      return next(createHttpError(404, " SingleBook not found"));
    }
 
   return  res.json(SingleList);
   
  } catch (error) {
    return next(createHttpError(500, "Error while getting SingleBook"));
  }

};

const deleteBook = async(req: Request,res: Response,next:NextFunction)=>{

  try {
    const bookId= req.params.bookId;
    const SingleList = await bookModel.findOne({_id:bookId});
    res.json(SingleList);
    
  } catch (error) {
    return next(createHttpError(500, "Error while getting SingleBook"));
  }

}
   




export {createBook, updateBook,AllBookList,SingleBookList,deleteBook};