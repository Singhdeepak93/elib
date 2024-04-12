import express from "express";
import { createBook } from "./bookController";


const bookRouter = express.Router();

//Router configuration
bookRouter.post('/', createBook)

export default bookRouter;