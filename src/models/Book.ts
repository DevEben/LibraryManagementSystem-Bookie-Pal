import mongoose, { Schema, Document } from "mongoose";

// Define the Book interface
export interface IBook extends Document {
  title: string;
  author: string;
  student: mongoose.Types.ObjectId | null;
  publisher: string;
  publicationDate: Date;
  ISBN: string;
  status: "available" | "borrowed";
}

// Define the Book schema
const BookSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    student: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
      default: null, 
    },
    publisher: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    publicationDate: {
      type: Date,
      required: true,
    },
    ISBN: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["available", "borrowed"],
      required: true,
      lowercase: true,
      default: "available",
    },
  },
  { timestamps: true }
);

// Export the Book model
export const Book = mongoose.model<IBook>("Book", BookSchema);

// Helper functions for Book
export const getBooks = async (): Promise<IBook[]> => {
  return Book.find().exec();
};

export const getBookById = async (id: string): Promise<IBook | null> => {
  return Book.findById(id).exec();
};

export const getBookByTitle = async (title: string): Promise<IBook | null> => {
  return Book.findOne({title}).exec();
};

export const getBooksByStatus = async (status: "available" | "borrowed"): Promise<IBook[]> => {
  return Book.find({ status }).exec();
};

export const createBook = async (values: Record<string, any>): Promise<IBook> => {
  const book = new Book(values);
  await book.save();
  return book.toObject();
};

export const updateBookById = async (
  id: string,
  values: Record<string, any>
): Promise<IBook | null> => {
  return Book.findOneAndUpdate({ _id: id }, values, { new: true }).exec();
};

export const deleteBookById = async (id: string): Promise<IBook | null> => {
  return Book.findOneAndDelete({ _id: id }).exec();
};
