import mongoose, { Schema, Document } from "mongoose";
import { setCache, getCache } from "../config/redisConfig";

// Define the Teacher interface
export interface ITeacher extends Document {
  firstName: string;
  lastName: string;
  email: string;
  userId: mongoose.Schema.Types.ObjectId;
  students: mongoose.Schema.Types.ObjectId[];
}

// Define the Teacher schema
const TeacherSchema: Schema = new Schema(
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
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { timestamps: true }
);

// Export the Teacher model
export const Teacher = mongoose.model<ITeacher>("Teacher", TeacherSchema);

// Helper functions for Teacher
export const getTeachers = async (): Promise<ITeacher[]> => {
  try {
    // Check if data is in cache
    const cachedTeachers = await getCache("teachers");
    if (cachedTeachers) {
      console.log("Returning teachers from cache");
      return JSON.parse(cachedTeachers);
    }

    // Data not in cache, fetch from DB
    const teachers = await Teacher.find().sort({ createdAt: -1 }).populate("students");

    // Cache the result
    await setCache("teachers", JSON.stringify(teachers), 3600); // Cache for 1 hour
    return teachers;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const getTeacherByEmail = async (email: string): Promise<ITeacher | null> => {
  try {
    const cacheKey = `teacher-email-${email}`;

    // Check if data is in cache
    const cachedTeacher = await getCache(cacheKey);
    if (cachedTeacher) {
      console.log(`Returning teacher by email ${email} from cache`);
      return JSON.parse(cachedTeacher);
    }

    // Data not in cache, fetch from DB
    const teacher = await Teacher.findOne({ email }).populate("students");

    if (teacher) {
      // Cache the result
      await setCache(cacheKey, JSON.stringify(teacher), 3600); // Cache for 1 hour
    }

    return teacher;
  } catch (error) {
    console.error(`Error fetching teacher by email ${email}:`, error);
    throw error;
  }
};

export const getTeacherById = async (id: string): Promise<ITeacher | null> => {
  try {
    const cacheKey = `teacher-id-${id}`;

    // Check if data is in cache
    const cachedTeacher = await getCache(cacheKey);
    if (cachedTeacher) {
      console.log(`Returning teacher by ID ${id} from cache`);
      return JSON.parse(cachedTeacher);
    }

    // Data not in cache, fetch from DB
    const teacher = await Teacher.findById(id).populate("students");

    if (teacher) {
      // Cache the result
      await setCache(cacheKey, JSON.stringify(teacher), 3600); // Cache for 1 hour
    }

    return teacher;
  } catch (error) {
    console.error(`Error fetching teacher by ID ${id}:`, error);
    throw error;
  }
};

export const createTeacher = async (values: Partial<ITeacher>): Promise<ITeacher> => {
  const teacher = new Teacher(values);
  await teacher.save();
  return teacher.toObject();
};

export const deleteTeacherById = async (id: string): Promise<ITeacher | null> => {
  return Teacher.findOneAndDelete({ _id: id })
};

export const updateTeacherById = async (
  id: string,
  values: Partial<ITeacher>
): Promise<ITeacher | null> => {
  return Teacher.findOneAndUpdate({ _id: id }, values, { new: true }).populate('students')
};
