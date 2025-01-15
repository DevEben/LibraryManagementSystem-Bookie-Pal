import express from 'express';
import { createABook, getAllBooks, getOneBook, updateABook, deleteABook, getBookByTheTitle } from '../controllers/bookController';

const router = express.Router();

// Book routes
router.post('/books', createABook);
router.get('/books', getAllBooks);
router.get('/books/:bookId', getOneBook);
router.get('/book/:title', getBookByTheTitle);
router.put('/books/:bookId', updateABook);
router.delete('/books/:bookId', deleteABook);

export default router;
