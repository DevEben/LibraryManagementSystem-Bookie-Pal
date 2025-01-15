import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  getStudents,
  getStudentByEmail,
  getStudentById,
  createStudent,
  deleteStudentById,
  updateStudentById,
} from "../models/Student";
import { Student } from "../models/Student";
import { validateStd, validateStdUpdate } from "../middleware/validator";
import { Teacher } from "../models/Teacher";

export const createAStudent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Validate student data
    const { error } = validateStd(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const studentData = {
      firstName: req.body.firstName.trim().toLowerCase(),
      lastName: req.body.lastName.trim().toLowerCase(),
      email: req.body.email.trim().toLowerCase(),
      teacherEmail: req.body.teacherEmail.trim().toLowerCase(),
    };

    const { firstName, lastName, email, teacherEmail } = studentData;

    if (!firstName || !lastName || !email || !teacherEmail) {
      return res.status(400).json({
        message: "Please provide all the required fields.",
      });
    }

    // Check if the student already exists
    const existingStudent = await getStudentByEmail(email);
    if (existingStudent) {
      return res.status(409).json({ message: "Student already exists." });
    }

    // Check if the teacher exists
    const teacher = await Teacher.findOne({ email: teacherEmail });
    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found. Please provide a valid teacher email.",
      });
    }

    // Create and save the student
    const student = await createStudent({
      firstName,
      lastName,
      email,
      teacher: teacher._id as mongoose.Types.ObjectId,
      userId: undefined,
    });

    student.userId = student._id as mongoose.Types.ObjectId;

    // Update the teacher to add this student
    if (!teacher.students) {
      teacher.students = [];
    }
    teacher.students.push(student._id as mongoose.Schema.Types.ObjectId);
    await teacher.save();
    await student.save();

    return res.status(201).json({
      message: "Student profile created successfully.",
      data: student,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error: " + error.message,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error: An unexpected error occurred.",
    });
  }
};


export const getAllStudents = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const students = await getStudents();
    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    return res.status(200).json({
      message: `${students.length} student(s) found`,
      data: students,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error: " + error.message,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error: An unexpected error occurred.",
    });
  }
};

export const getOneStudent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.params.userId;
    const student = await getStudentById(userId);
    if (!student) {
      return res.status(404).json({ message: "No students found" });
    }

    return res.status(200).json({
      message: `Student successfully fetched!`,
      data: student,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error: " + error.message,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error: An unexpected error occurred.",
    });
  }
};


export const getBooksByStudent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.params.userId;
    const student = await getStudentById(userId);
    if (!student) {
      return res.status(404).json({ message: "No students found" });
    }

    return res.status(200).json({
      message: `Retrieved all books borrowed by ${student.firstName} ${student.lastName}`,
      data: student.borrowedBooks,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error: " + error.message,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error: An unexpected error occurred.",
    });
  }
};



export const updateAStudent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { error } = validateStdUpdate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const userId = req.params.userId;
    const student = await getStudentById(userId);
    if (!student) {
      return res.status(404).json({ message: "No students found" });
    }

    const studentUpdateData = {
      firstName: req.body.firstName.trim().toLowerCase() || student.firstName,
      lastName: req.body.lastName.trim().toLowerCase() || student.lastName,
      email: req.body.email.trim().toLowerCase() || student.email,
    };

    const updatedStudent = await updateStudentById(userId, studentUpdateData);

    return res.status(201).json({
      message: "Student data updated successfully",
      data: updatedStudent,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error: " + error.message,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error: An unexpected error occurred.",
    });
  }
};

export const deleteAStudent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.params.userId;
    const student = await getStudentById(userId);
    if (!student) {
      return res.status(404).json({ message: "No students found" });
    }

    await deleteStudentById(userId);

    return res.status(201).json({
      message: "Student data deleted successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error: " + error.message,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error: An unexpected error occurred.",
    });
  }
};
