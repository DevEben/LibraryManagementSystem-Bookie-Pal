import express from 'express';
import { createATeacher, getAllTeachers, getOneTeacher, updateATeacher, deleteATeacher } from '../controllers/teacherController';

const router = express.Router();

// Teacher routes
router.post('/teachers', createATeacher);
router.get('/teachers', getAllTeachers);
router.get('/teachers/:userId', getOneTeacher);
router.put('/teachers/:userId', updateATeacher);
router.delete('/teachers/:userId', deleteATeacher);

export default router;
