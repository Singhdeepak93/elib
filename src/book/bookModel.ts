import mongoose from 'mongoose';
import { Book } from './boolTypes';


const bookSchema = new mongoose.Schema<Book>({
    title:{
        type: 'string',
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    genre:{
        type: 'string',
        required: true
    },
    coverImage:{
        type: 'string',
        required: true
    },
    file:{
        type: 'string',
        required: true
    },

},{timestamps:true});

export default mongoose.model<Book>('Book',bookSchema)