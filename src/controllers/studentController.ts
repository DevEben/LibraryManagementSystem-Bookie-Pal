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

export const createAStudent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { error } = validateStd(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const studentData = {
      firstName: req.body.firstName.trim().toLowerCase(),
      lastName: req.body.lastName.trim().toLowerCase(),
      email: req.body.email.trim().toLowerCase(),
    };
    const { firstName, lastName, email } = studentData;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: "Please provide all the required fields",
      });
    }

    const checkStudent = await getStudentByEmail(email);
    if (checkStudent) {
      return res.status(409).json({
        message: "Student already exists",
      });
    }

    const student = await createStudent(studentData);
    student.userId = student._id as mongoose.Types.ObjectId;
    await student.save();

    return res.status(201).json({
      message: "Student profile created successfully",
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
