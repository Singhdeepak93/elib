import express from "express";
import { AllBookList, createBook, updateBook } from "./bookController";
import multer from "multer";
import path from "node:path";
import authenticate from "../middlewares/authenticate";


const bookRouter = express.Router();


//file upload multer
const upload = multer({
     dest: path.resolve(__dirname,'../../public/data/uploads'),
     //limit file upload then 10 mb max size
     limits:{fileSize:1e7}
     })

//Router configuration
bookRouter.post('/', authenticate ,upload.fields([
    {name:"coverImage",maxCount:1},
    {name:"file",maxCount:1},
]), createBook);

bookRouter.patch('/:bookId', authenticate ,upload.fields([
    {name:"coverImage",maxCount:1},
    {name:"file",maxCount:1},
]), updateBook);

bookRouter.get('/', AllBookList)

export default bookRouter;