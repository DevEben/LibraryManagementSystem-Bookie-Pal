import { Request, Response } from "express";
import {
  getBooks,
  getBookById,
  getBookByTitle,
  createBook,
  deleteBookById,
  updateBookById,
} from "../models/Book";

import {Book} from '../models/Book';

import { validateBook, validateBookUpdate } from "../middleware/validator";

// Create a new book
export const createABook = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error } = validateBook(req.body); 
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, author, publisher, publicationDate, ISBN, status } = req.body;
    
    const newBook = {
      title,
      author,
      publisher,
      publicationDate,
      ISBN,
      status,
      student: null,
    };

    const bookExist = await Book.findOne({ISBN: newBook.ISBN})
    if (bookExist) return res.status(200).json({
        message: "Book with this ISBN already exist in the database"
    })

    const createdBook = await createBook(newBook);

    return res.status(201).json({
      message: "Book created successfully",
      data: createdBook,
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

// Get all books
export const getAllBooks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const books = await getBooks();
    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    return res.status(200).json({
      message: `${books.length} book(s) found`,
      data: books,
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

// Get one book by ID
export const getOneBook = async (req: Request, res: Response): Promise<Response> => {
  try {
    const bookId = req.params.bookId;
    const book = await getBookById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({
      message: "Book fetched successfully",
      data: book,
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


// Get one book by ID
export const getBookByTheTitle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const title = req.params.title;
      const book = await getBookByTitle(title);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      return res.status(200).json({
        message: "Book fetched successfully",
        data: book,
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



// Update a book
export const updateABook = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error } = validateBookUpdate(req.body); // Validate the book data for update
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const bookId = req.params.bookId;
    const { title, author, publisher, publicationDate, ISBN, status, student } = req.body;

    const book = await getBookById(bookId)
    if (!book) return res.status(404).json({
        message: "Book not found"
    })

    const updatedData = {
      title: title || book.title,
      author: author || book.author,
      publisher: publisher || book.publisher,
      publicationDate: publicationDate || book.publicationDate,
      ISBN: ISBN || book.ISBN,
      status: status || book.status,
      student: student || null,
    };

    const updatedBook = await updateBookById(bookId, updatedData);

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({
      message: "Book updated successfully",
      data: updatedBook,
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

// Delete a book by ID
export const deleteABook = async (req: Request, res: Response): Promise<Response> => {
  try {
    const bookId = req.params.bookId;
    const book = await getBookById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await deleteBookById(bookId);

    return res.status(200).json({
      message: "Book deleted successfully",
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
