import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  getTeachers,
  getTeacherByEmail,
  getTeacherById,
  createTeacher,
  deleteTeacherById,
  updateTeacherById,
} from "../models/Teacher";
import { Teacher, ITeacher } from "../models/Teacher";
import { validateStd, validateStdUpdate } from "../middleware/validator";

export const createATeacher = async (
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
  
      const teacherData = {
        firstName: req.body.firstName.trim().toLowerCase(),
        lastName: req.body.lastName.trim().toLowerCase(),
        email: req.body.email.trim().toLowerCase(),
      };
      const { firstName, lastName, email } = teacherData;
      if (!firstName || !lastName || !email) {
        return res.status(400).json({
          message: "Please provide all the required fields",
        });
      }
  
      const checkTeacher = await getTeacherByEmail(email);
      if (checkTeacher) {
        return res.status(409).json({
          message: "Teacher already exists",
        });
      }
  
      const teacher: ITeacher = await createTeacher(teacherData);
  
      // Explicitly cast teacher._id to ObjectId if necessary
      teacher.userId = teacher._id as mongoose.Types.ObjectId;
      
      await teacher.save();
  
      return res.status(201).json({
        message: "Teacher profile created successfully",
        data: teacher,
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


export const getAllTeachers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const teachers = await getTeachers();
    if (teachers.length === 0) {
      return res.status(404).json({ message: "No teachers found" });
    }

    return res.status(200).json({
      message: `${teachers.length} teacher(s) found`,
      data: teachers,
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


export const getAllStudentsOfTeacher = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {

    const userId = req.params.userId;
    const teacher = await getTeacherById(userId);
    if (!teacher) {
      return res.status(404).json({ message: "No teacher found" });
    }

    return res.status(200).json({
      message: `Retrieved all students from ${teacher.firstName} ${teacher.lastName}`,
      data: teacher.students,
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


export const getOneTeacher = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.params.userId;
    const teacher = await getTeacherById(userId);
    if (!teacher) {
      return res.status(404).json({ message: "No teacher found" });
    }

    return res.status(200).json({
      message: `Teacher successfully fetched!`,
      data: teacher,
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

export const updateATeacher = async (
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
    const teacher = await getTeacherById(userId);
    if (!teacher) {
      return res.status(404).json({ message: "No teacher found" });
    }

    const teacherUpdateData = {
      firstName: req.body.firstName.trim().toLowerCase() || teacher.firstName,
      lastName: req.body.lastName.trim().toLowerCase() || teacher.lastName,
      email: req.body.email.trim().toLowerCase() || teacher.email,
    };

    const updatedTeacher = await updateTeacherById(userId, teacherUpdateData);

    return res.status(201).json({
      message: "Teacher data updated successfully",
      data: updatedTeacher,
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

export const deleteATeacher = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.params.userId;
    const teacher = await getTeacherById(userId);
    if (!teacher) {
      return res.status(404).json({ message: "No teacher found" });
    }

    await deleteTeacherById(userId);

    return res.status(201).json({
      message: "Teacher data deleted successfully",
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
