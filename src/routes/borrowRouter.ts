import express from 'express';
import { borrowBook, returnBorrowedBooks, getAllBorrowedBooks, getBorrowedBookByStudent } from '../controllers/borrowController';
import { authenticate } from '../middleware/authentication';

const router = express.Router();

// Borrowed routes
router.post('/borrowed', authenticate, borrowBook);
router.get('/borrowed', authenticate, getAllBorrowedBooks);
router.get('/borrowed/:borrowedId', authenticate, getBorrowedBookByStudent);
router.put('/borrowed/:borrowedId', authenticate, returnBorrowedBooks); 

export default router;
