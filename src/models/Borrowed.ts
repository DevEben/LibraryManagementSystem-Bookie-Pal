import mongoose, { Schema, Document } from "mongoose";

// Define the Borrow interface
export interface IBorrow extends Document {
  bookId: mongoose.Types.ObjectId | null;
  studentId: mongoose.Types.ObjectId | null;
  borrowDate: Date;
  returnDate: Date | null;
  status: "pending" | "approved" | "rejected";
}

// Define the Borrow schema
const BorrowSchema: Schema = new Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true, 
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true, 
    },
    borrowDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null, 
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
      lowercase: true,
      default: "pending", 
    },
  },
  { timestamps: true }
);

// Export the Borrow model
export const Borrow = mongoose.model<IBorrow>("Borrow", BorrowSchema);

// Helper functions for Borrow
export const getBorrows = async (): Promise<IBorrow[]> => {
  return Borrow.find().exec();
};

export const getBorrowById = async (id: string): Promise<IBorrow | null> => {
  return Borrow.findById(id).exec();
};

export const getBorrowsByStudentId = async (studentId: string): Promise<IBorrow[]> => {
  return Borrow.find({ studentId }).exec();
};

export const getBorrowsByBookId = async (bookId: string): Promise<IBorrow[]> => {
  return Borrow.find({ bookId }).exec();
};

export const createBorrow = async (values: Record<string, any>): Promise<IBorrow> => {
  const borrow = new Borrow(values);
  await borrow.save();
  return borrow.toObject();
};

export const updateBorrowById = async (
  id: string,
  values: Record<string, any>
): Promise<IBorrow | null> => {
  return Borrow.findOneAndUpdate({ _id: id }, values, { new: true }).exec();
};

export const deleteBorrowById = async (id: string): Promise<IBorrow | null> => {
  return Borrow.findOneAndDelete({ _id: id }).exec();
};
