import express from 'express';
import { 
  borrowBook, 
  returnBorrowedBooks, 
  getAllBorrowedBooks, 
  getBorrowedBookByStudent 
} from '../controllers/borrowController';
import { authenticate } from '../middleware/authentication';

const router = express.Router();

// Endpoint to borrow a book
router.post('/borrowed', authenticate, borrowBook);

// Endpoint to get all borrowed books
router.get('/borrowed', authenticate, getAllBorrowedBooks);

// Endpoint to get details of a borrowed book by a student
router.get('/borrowed/:borrowedId', authenticate, getBorrowedBookByStudent);

// Endpoint to return a borrowed book
router.put('/borrowed/:borrowedId', authenticate, returnBorrowedBooks);

export default router;
