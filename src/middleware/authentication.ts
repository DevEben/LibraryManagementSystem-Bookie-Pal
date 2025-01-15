// import express, { Request, Response, NextFunction } from "express";
// import { User } from '../models/UserAuth';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import dotenv from "dotenv";

// dotenv.config();


// export interface AuthenticatedRequest extends Request {
//     user: { userId: string;};
// }

// const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     try {
//         const hasAuthorization = req.headers.authorization;
//         if (!hasAuthorization) {
//             return res.status(400).json({
//                 message: 'Invalid authorization',
//             });
//         }

//         const token = hasAuthorization.split(" ")[1];
//         if (!token) {
//             return res.status(404).json({
//                 message: "Token not found",
//             });
//         }

//         const SECRET = process.env.SECRET as string;
//         if (!SECRET) {
//             return res.status(500).json({
//                 message: "Internal error: Secret key not defined",
//             });
//         }

//         const decodedToken = jwt.verify(token, SECRET) as JwtPayload & { userId: string };
//         const user = await User.findById(decodedToken.userId);
//         if (!user) {
//             return res.status(404).json({
//                 message: "Not authorized: User not found",
//             });
//         }

//         (req as AuthenticatedRequest).user = decodedToken;
//         req.user = { userId: decodedToken.userId };


//         next();
//     } catch (error: any) {
//         if (error instanceof jwt.JsonWebTokenError) {
//             return res.status(401).json({
//                 message: 'Session timeout, please login to continue',
//             });
//         }
//         return res.status(500).json({
//             error: "Authentication Error: " + error.message,
//         });
//     }
// };


// export { authenticate };


import express, { Request, Response, NextFunction } from "express";
import { User } from "../models/UserAuth";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Extend the Request interface for authentication
export interface AuthenticatedRequest extends Request {
  user?: { userId: string } | any;
}

const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const hasAuthorization = req.headers.authorization;
    if (!hasAuthorization) {
      return res.status(400).json({
        message: "Authorization header is missing",
      });
    }

    const token = hasAuthorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Token not found",
      });
    }

    const SECRET = process.env.SECRET;
    if (!SECRET) {
      console.error("SECRET key is not defined in the environment variables.");
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, SECRET) as JwtPayload & {
      userId: string;
    };

    // Find the user in the database
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Attach the user ID to the request
    req.user = { userId: decodedToken.userId };

    next();
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Invalid or expired token, please log in again",
      });
    }
    console.error("Authentication error:", error);
    return res.status(500).json({
      message: `Authentication Error: ${error.message}`,
    });
  }
};

export { authenticate };
