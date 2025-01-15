import express from 'express';
import { 
  createATeacher, 
  getAllTeachers, 
  getAllStudentsOfTeacher, 
  getOneTeacher, 
  updateATeacher, 
  deleteATeacher 
} from '../controllers/teacherController';

const router = express.Router();

// Endpoint to create a new teacher
router.post('/teachers', createATeacher);

// Endpoint to get all teachers
router.get('/teachers', getAllTeachers);

// Endpoint to get all students assigned to a specific teacher
router.get('/teacher/student/:userId', getAllStudentsOfTeacher);

// Endpoint to get details of a specific teacher
router.get('/teachers/:userId', getOneTeacher);

// Endpoint to update details of a specific teacher
router.put('/teachers/:userId', updateATeacher);

// Endpoint to delete a specific teacher
router.delete('/teachers/:userId', deleteATeacher);

export default router;
