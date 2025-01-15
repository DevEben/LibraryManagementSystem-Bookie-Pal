import express from 'express';
import { 
  createAStudent, 
  getAllStudents, 
  getBooksByStudent, 
  getOneStudent, 
  updateAStudent, 
  deleteAStudent 
} from '../controllers/studentController';

const router = express.Router();

// Endpoint to create a new student
router.post('/students', createAStudent);

// Endpoint to get all students
router.get('/students', getAllStudents);

// Endpoint to get details of a specific student
router.get('/students/:userId', getOneStudent);

// Endpoint to get all books assigned to a specific student
router.get('/student/books/:userId', getBooksByStudent);

// Endpoint to update details of a specific student
router.put('/students/:userId', updateAStudent);

// Endpoint to delete a specific student
router.delete('/students/:userId', deleteAStudent);

export default router;
