import { setCache, getCache } from "../config/redisConfig";
import mongoose, { Schema, Document } from "mongoose";

// Define the Student interface
export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  userId: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  borrowedBooks: mongoose.Types.ObjectId[];
}

// Define the Student schema
const StudentSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    teacher: {
      type: mongoose.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    borrowedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Borrow",
      },
    ],
  },
  { timestamps: true }
);

// Export the Student model
export const Student = mongoose.model<IStudent>("Student", StudentSchema);

// Helper functions for Student
export const getStudents = async (): Promise<IStudent[]> => {
  try {
    // Check if data is in cache
    const cachedStudents = await getCache("students");
    if (cachedStudents) {
      console.log("Returning students from cache");
      return JSON.parse(cachedStudents);
    }

    // Data not in cache, fetch from DB
    const students = await Student.find()
      .sort({ createdAt: -1 })
      .populate("teacher borrowedBooks");

    // Cache the result
    await setCache("students", JSON.stringify(students), 3600); // Cache for 1 hour
    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const getStudentByEmail = async (email: string): Promise<IStudent | null> => {
  try {
    const cacheKey = `student-email-${email}`;

    // Check if data is in cache
    const cachedStudent = await getCache(cacheKey);
    if (cachedStudent) {
      console.log(`Returning student by email ${email} from cache`);
      return JSON.parse(cachedStudent);
    }

    // Data not in cache, fetch from DB
    const student = await Student.findOne({ email }).populate("teacher borrowedBooks");

    if (student) {
      // Cache the result
      await setCache(cacheKey, JSON.stringify(student), 3600); // Cache for 1 hour
    }

    return student;
  } catch (error) {
    console.error(`Error fetching student by email ${email}:`, error);
    throw error;
  }
};

export const getStudentById = async (id: string): Promise<IStudent | null> => {
  try {
    const cacheKey = `student-id-${id}`;

    // Check if data is in cache
    const cachedStudent = await getCache(cacheKey);
    if (cachedStudent) {
      console.log(`Returning student by ID ${id} from cache`);
      return JSON.parse(cachedStudent);
    }

    // Data not in cache, fetch from DB
    const student = await Student.findById(id).populate("teacher borrowedBooks");

    if (student) {
      // Cache the result
      await setCache(cacheKey, JSON.stringify(student), 3600); // Cache for 1 hour
    }

    return student;
  } catch (error) {
    console.error(`Error fetching student by ID ${id}:`, error);
    throw error;
  }
};

export const createStudent = async (
  values: Partial<IStudent>
): Promise<IStudent> => {
  const student = new Student(values);
  await student.save();
  return student.toObject();
};

export const deleteStudentById = async (
  id: string
): Promise<IStudent | null> => {
  return Student.findOneAndDelete({ _id: id });
};

export const updateStudentById = async (
  id: string,
  values: Partial<IStudent>
): Promise<IStudent | null> => {
  return Student.findOneAndUpdate({ _id: id }, values, { new: true }).populate(
    "teacher borrowedBooks"
  );
};
