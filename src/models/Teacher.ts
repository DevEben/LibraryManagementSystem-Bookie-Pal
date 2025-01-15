import mongoose, { Schema, Document } from "mongoose";

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
  return Teacher.find().sort({ createdAt: -1 }).populate('students')
};

export const getTeacherByEmail = async (email: string): Promise<ITeacher | null> => {
  return Teacher.findOne({ email }).populate('students')
};

export const getTeacherById = async (id: string): Promise<ITeacher | null> => {
  return Teacher.findById(id).populate('students')
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
