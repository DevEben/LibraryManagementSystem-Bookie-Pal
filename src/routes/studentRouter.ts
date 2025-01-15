import express from 'express';
import { createAStudent, getAllStudents, getOneStudent, updateAStudent, deleteAStudent } from '../controllers/studentController';

const router = express.Router();

// Student routes
router.post('/students', createAStudent);
router.get('/students', getAllStudents);
router.get('/students/:userId', getOneStudent);
router.put('/students/:userId', updateAStudent);
router.delete('/students/:userId', deleteAStudent);

export default router;
