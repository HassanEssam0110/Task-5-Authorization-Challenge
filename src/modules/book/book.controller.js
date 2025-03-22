import * as handler from "../api-handler-factory.js";
import { Book } from "../../database/models/index.models.js";

const getAllBooks = handler.getAll(Book);
const getBook = handler.getOne(Book);
const createBook = handler.createOne(Book);
const updateBook = handler.updateOne(Book);
const deleteBook = handler.deleteOne(Book);

export { getAllBooks, getBook, createBook, updateBook, deleteBook };
