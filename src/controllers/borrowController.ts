import { Request, Response } from "express";
import mongoose from "mongoose";
import { Borrow, createBorrow, getBorrows, getBorrowsByStudentId, updateBorrowById } from "../models/Borrowed";
import { validateBorrowedBook } from "../middleware/validator";

export const borrowBook = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error } = validateBorrowedBook(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { studentId, bookId, borrowDate } = req.body;
    if (!studentId || !bookId || !borrowDate) {
      return res.status(400).json({
        message: "Please provide all the required fields",
      });
    }

    // Use the createBorrow function from the model
    const borrowData = {
      studentId: new mongoose.Types.ObjectId(studentId),
      bookId: new mongoose.Types.ObjectId(bookId),
      borrowDate: new Date(borrowDate),
      status: "pending",
    };

    const borrowedBook = await createBorrow(borrowData); // Create borrow record
    return res.status(201).json({
      message: "Book borrowed successfully",
      data: borrowedBook,
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

export const getAllBorrowedBooks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const borrowedBooks = await getBorrows();
    if (borrowedBooks.length === 0) {
      return res.status(404).json({ message: "No borrowed books found" });
    }

    return res.status(200).json({
      message: `${borrowedBooks.length} borrowed book(s) found`,
      data: borrowedBooks,
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

export const getBorrowedBookByStudent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const studentId = req.params.studentId;
    const borrowedBooks = await getBorrowsByStudentId(studentId);
    if (!borrowedBooks || borrowedBooks.length === 0) {
      return res.status(404).json({ message: "No borrowed books found for this student" });
    }

    return res.status(200).json({
      message: `Borrowed books successfully fetched!`,
      data: borrowedBooks,
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

export const returnBorrowedBooks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const borrowId = req.params.borrowId;

    // First, find the borrow record
    const borrowedBook = await Borrow.findById(borrowId).exec();
    if (!borrowedBook) {
      return res.status(404).json({ message: "No borrowed book found" });
    }

    // If the borrow record exists, we update the return date and status
    const updatedBorrow = await updateBorrowById(borrowId, {
      returnDate: new Date(),
      status: "approved", // Assuming that returning the book means it gets approved
    });

    return res.status(200).json({
      message: "Book returned successfully",
      data: updatedBorrow,
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
