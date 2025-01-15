import express from 'express';
import { 
  createABook, 
  getAllBooks, 
  getOneBook, 
  updateABook, 
  deleteABook, 
  getBookByTheTitle 
} from '../controllers/bookController';

const router = express.Router();

// Endpoint to create a new book
router.post('/books', createABook);

// Endpoint to get all books
router.get('/books', getAllBooks);

// Endpoint to get details of a specific book by ID
router.get('/books/:bookId', getOneBook);

// Endpoint to get details of a book by title
router.get('/book/:title', getBookByTheTitle);

// Endpoint to update a specific book by ID
router.put('/books/:bookId', updateABook);

// Endpoint to delete a specific book by ID
router.delete('/books/:bookId', deleteABook);

export default router;
