import Joi, { ObjectSchema, ValidationResult } from '@hapi/joi';
import mongoose from 'mongoose';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    teacherEmail?: string;
}

interface ResetPasswordData {
    password: string;
    confirmPassword: string;
}

interface UserStdData {
    firstName: string;
    lastName: string;
    email: string;
}

interface Book {
    title: string;
    author: string;
    publisher: string;
    publicationDate: Date;
    ISBN: string;
    status: "available" | "borrowed";
    student?: string;
}

export interface IBorrowedBook {
    bookId: mongoose.Types.ObjectId | null;
    studentId: mongoose.Types.ObjectId | null;
    borrowDate: Date;
    returnDate: Date | null;
    status: "pending" | "approved" | "rejected";
  }


const validateUser = (data: UserData): ValidationResult => {
    const userValidationSchema: ObjectSchema<UserData> = Joi.object({
        firstName: Joi.string().min(3).required().messages({
            "string.min": "FirstName must be at least 3 characters long",
            "any.required": "FirstName is required",
        }),
        lastName: Joi.string().min(3).required().messages({
            "string.min": "lastName must be at least 3 characters long",
            "any.required": "lastName is required",
        }),
        email: Joi.string().email().required().messages({
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required",
        }),
        teacherEmail: Joi.string().email().messages({
            "string.email": "Please provide a valid email address",
            "any.required": "Teacher Email is required",
        }),
        password: Joi.string().min(6).pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)).required().messages({
            "string.min": "Password must be at least 8 characters long",
            "string.max": "Password must not exceed 20 characters",
            "string.pattern.base": "Password must contain lowercase, uppercase, numbers, and special characters",
            "any.required": "Password field can't be left empty",
        }),
        role: Joi.string().valid("admin", "teacher", "student").required().messages({
            "any.required": "Role is required",
            "any.only": "Role must be either admin, teacher, or student",
        }),
    });

    return userValidationSchema.validate(data, { abortEarly: false });
};


const validateStd = (data: UserStdData): ValidationResult => {
    const userValidationSchema: ObjectSchema<UserStdData> = Joi.object({
        firstName: Joi.string().min(3).required().messages({
            "string.min": "FirstName must be at least 3 characters long",
            "any.required": "FirstName is required",
        }),
        lastName: Joi.string().min(3).required().messages({
            "string.min": "lastName must be at least 3 characters long",
            "any.required": "lastName is required",
        }),
        email: Joi.string().email().required().messages({
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required",
        }),
    })

    return userValidationSchema.validate(data, { abortEarly: false });
}


const validateStdUpdate = (data: UserStdData): ValidationResult => {
    const userValidationSchema: ObjectSchema<UserStdData> = Joi.object({
        firstName: Joi.string().min(3).messages({
            "string.min": "FirstName must be at least 3 characters long",
        }),
        lastName: Joi.string().min(3).messages({
            "string.min": "lastName must be at least 3 characters long",
        }),
        email: Joi.string().email().messages({
            "string.email": "Please provide a valid email address",
        }),
    })

    return userValidationSchema.validate(data, { abortEarly: false });
}


const validateEmail = (data: { email: string }): ValidationResult => {
    const validateSchema: ObjectSchema<{ email: string }> = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required",
        }),
    })

    return validateSchema.validate(data, { abortEarly: false });
}

const validateResetPassword = (data: ResetPasswordData): ValidationResult => {
    const validateSchema: ObjectSchema<ResetPasswordData> = Joi.object({
        password: Joi.string()
            .min(8)
            .max(20)
            .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/))
            .required()
            .messages({
                "string.min": "Password must be at least 8 characters long",
                "string.max": "Password must not exceed 20 characters",
                "string.pattern.base": "Password must contain lowercase, uppercase, numbers, and special characters",
                "any.required": "Password field can't be left empty",
            }),
        confirmPassword: Joi.string()
            .min(8)
            .max(20)
            .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/))
            .required()
            .messages({
                "string.min": "Confirm Password must be at least 8 characters long",
                "string.max": "Confirm Password must not exceed 20 characters",
                "string.pattern.base": "Confirm Password must contain lowercase, uppercase, numbers, and special characters",
                "any.required": "Confirm Password field can't be left empty",
            }),
    }).custom((data, helpers) => {
        if (data.password !== data.confirmPassword) {
            return helpers.message({ custom: "Password and Confirm Password must match" });
        }
        return data;
    });

    return validateSchema.validate(data, { abortEarly: false });
};


const validateUpdatedUser = (data: UserData): ValidationResult => {
    const userValidationSchema: ObjectSchema<UserData> = Joi.object({
        username: Joi.string().min(3).messages({
            "string.min": "Username must be at least 3 characters long",
            "any.required": "Username is required",
        }),
        email: Joi.string().email().messages({
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required",
        }),
        password: Joi.string().min(6).messages({
            "string.min": "Password must be at least 6 characters long",
            "any.required": "Password is required",
        }),
    });

    return userValidationSchema.validate(data, { abortEarly: false });
};


// Validation schema for creating a new book
const validateBook = (bookData: Book): ValidationResult => {
    const schema: ObjectSchema<Book> = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        author: Joi.string().min(3).max(255).required(),
        publisher: Joi.string().min(3).max(255).required(),
        publicationDate: Joi.date().less("now").required(),
        ISBN: Joi.string().min(10).max(13).required(), // Assuming ISBN length between 10 and 13 digits
        status: Joi.string().valid("available", "borrowed").required(),
    });

    return schema.validate(bookData);
};

// Validation schema for updating an existing book
const validateBookUpdate = (bookData: Partial<Book>): ValidationResult => {
    const schema: ObjectSchema<Partial<Book>> = Joi.object({
        title: Joi.string().min(3).max(255).optional(),
        author: Joi.string().min(3).max(255).optional(),
        publisher: Joi.string().min(3).max(255).optional(),
        publicationDate: Joi.date().less("now").optional(),
        ISBN: Joi.string().min(10).max(13).optional(),
        status: Joi.string().valid("available", "borrowed").optional(),
        student: Joi.string().optional(), // Can be assigned when a student borrows the book
    });

    return schema.validate(bookData);
};


// Validator for borrowing a book
const validateBorrowedBook = (data: IBorrowedBook) => {
    const schema = Joi.object({
      studentId: Joi.string().required().messages({
        "string.base": `"studentId" should be a type of 'text'`,
        "string.empty": `"studentId" cannot be an empty field`,
        "any.required": `"studentId" is a required field`,
      }),
      bookId: Joi.string().required().messages({
        "string.base": `"bookId" should be a type of 'text'`,
        "string.empty": `"bookId" cannot be an empty field`,
        "any.required": `"bookId" is a required field`,
      }),
      borrowDate: Joi.date().iso().required().messages({
        "date.base": `"borrowDate" should be a valid date`,
        "any.required": `"borrowDate" is a required field`,
      }),
    });
  
    return schema.validate(data);
  };


export { 
    validateUser, 
    validateStd, 
    validateStdUpdate,
    validateEmail, 
    validateResetPassword, 
    validateUpdatedUser, 
    validateBook, 
    validateBookUpdate, 
    validateBorrowedBook, 
};
