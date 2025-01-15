import { Request, Response } from "express";
import { getUserByEmail, getUserById, createUser, updateUserById, getUsers, deleteUserById,} from "../models/UserAuth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/email";
import { generateDynamicEmail } from "../utils/emailText";
import { verifiedHTML } from "../utils/verified";
import { AuthenticatedRequest } from "../middleware/authentication";
import { resetFunc } from "../utils/forgot";
import { validateUser, validateResetPassword, validateUpdatedUser, validateEmail } from "../middleware/validator";
import { generateLoginNotificationEmail } from "../utils/sendLoginEmail";
import {Student} from "../models/Student";
import {Teacher} from "../models/Teacher";
import Bowser from "bowser";
import mongoose from "mongoose";


// Function to get device information from user-agent
const getDeviceInfo = (userAgent: string) => {
    const parser = Bowser.getParser(userAgent);
    const browserInfo = parser.getBrowser();
    const osInfo = parser.getOS();
    const platformInfo = parser.getPlatform();
  
    return {
      browser: {
        name: browserInfo.name || "Unknown browser",
        version: browserInfo.version || "Unknown version",
      },
      os: {
        name: osInfo.name || "Unknown OS",
        version: osInfo.version || "Unknown version",
      },
      platform: platformInfo.type || "web", // "desktop", "mobile", "tablet", etc.
    };
  };

const toTitleCase = (str: string) => {
  return str.toLowerCase().split(" ").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

// Function to Register a new user on the platform
export const signUp_User = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const userDetail = {
      firstName: req.body.firstName.toLowerCase().trim(),
      lastName: req.body.lastName.toLowerCase().trim(),
      email: req.body.email.toLowerCase().trim(),
      password: req.body.password,
      role: req.body.role.toLowerCase().trim(),
    };

    const { firstName, lastName, email, password, role } = userDetail

    if ( !firstName || !lastName || !email || !password || !role ) {
      return res.status(400).json({ message: "Please fill all fields below!" });
    }

    const emailExist = await getUserByEmail(userDetail.email);
    if (emailExist)
      return res.status(400).json({ message: "Email already exists!" });

    // Hash password
    const SALT_ROUNDS = 12;
    const hashedPassword = bcrypt.hashSync(userDetail.password, SALT_ROUNDS);

    const user = await createUser({
      firstName: userDetail.firstName,
      lastName: userDetail.lastName,
      email: userDetail.email,
      password: hashedPassword,
      role: userDetail.role
    });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET as string, {
      expiresIn: "1800s",
    });
    user.token = token;
    const subject = "Email Verification";
    const name = `${user.firstName} ${user.lastName}`;

    const link = `${req.protocol}://${req.get("host")}/api/v1/verify-user/${
      user._id
    }/${user.token}`;
    const html = generateDynamicEmail((name), link);

    try {
      await sendMail({
        email: user.email,
        html,
        subject,
      });
    } catch (emailError: any) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({
        message:
          "Account created, but failed to send verification email. Please contact support.",
        error: emailError.message,
      });
    }

    if (role === 'student') {
      const { teacherEmail } = req.body;
  
      if (!teacherEmail) {
          return res.status(400).json({ message: "Teacher's email is required for student registration." });
      }
  
      // Check if teacher exists
      const teacher = await Teacher.findOne({ email: teacherEmail });
      if (!teacher) {
          return res.status(404).json({ message: "Teacher not found. Please provide a valid teacher email." });
      }
  
      const student = new Student({
          firstName,
          lastName,
          email,
          userId: user.id,
          teacher: teacher._id, // Reference the teacher
      });
  
      // Save the student
      await student.save();
  
      // Update the teacher to add this student
      teacher.students = teacher.students || [];
      teacher.students.push(student._id as mongoose.Schema.Types.ObjectId);
      await teacher.save();
  } else if (role === 'teacher') {
      const teacher = new Teacher({
          firstName,
          lastName,
          email,
          userId: user._id,
      });
  
      // Save the teacher
      await teacher.save();
  }  

    return res.status(201).json({
      message:
        "Successfully created an account, Please log in to your email and verify your account",
      data: {
        ...user,
        password: undefined,
      },
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

//Function to verify a new user through link
export const verify_User = async (req: Request, res: Response) => {
  try {
    const { id, token } = req.params;

    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: "user not found" });

    // Verify the token
    jwt.verify(token, process.env.SECRET as string, async (err, decoded) => {
      if (err) {
        // If token is invalid/expired, generate a new token and ask the user to re-verify
        const newToken = jwt.sign(
          { userId: user._id },
          process.env.SECRET as string,
          { expiresIn: "1800s" }
        );

        user.token = newToken;
        await user.save();

        const link = `${req.protocol}://${req.get(
          "host"
        )}/api/v1/verify-user/${id}/${newToken}`;
        const name = `${user.firstName} ${user.lastName}`;
        await sendMail({
          email: user.email,
          html: generateDynamicEmail(name, link),
          subject: "RE-VERIFY YOUR ACCOUNT",
        });

        return res
          .status(400)
          .send(
            "Token expired. A new verification link has been sent to your email."
          );
      } else {
        // Token is valid, proceed to verify the user
        const userVerified = await updateUserById( id, { isVerified: true }, { new: true } );
        return res.send(verifiedHTML());
      }
    });
  } catch (error: unknown) {
    // Type guard to check if the error is an instance of Error
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error: " + error.message,
      });
    }

    // Fallback for unexpected error types
    return res.status(500).json({
      message: "Internal Server Error: An unexpected error occurred.",
    });
  }
};


//Function to login a verified user
export const logIn_User = async (req: Request, res: Response) => {
  try {
    const userData = {
      email: req.body.email.trim(),
      password: req.body.password.trim(),
    };

    if (!userData)
      return res
        .status(400)
        .json({ message: "Please fill all the field below!" });

    const checkEmail = await getUserByEmail(userData.email.toLowerCase());
    if (!checkEmail)
      return res.status(404).json({ message: "User not registered" });

    const checkPassword = bcrypt.compareSync(
      userData.password,
      checkEmail.password
    );
    if (!checkPassword)
      return res.status(404).json({ message: "Password is incorrect" });

    const token = jwt.sign(
      { userId: checkEmail._id },
      process.env.SECRET as string,
      { expiresIn: "20h" }
    );
    checkEmail.token = token;

    await checkEmail.save();

  // Get device information from user-agent
  const userAgent = req.headers['user-agent'] as string;
  const deviceInfo = getDeviceInfo(userAgent);
  const deviceType = deviceInfo.platform;
  const deviceBrowser = `${deviceInfo.browser.name} ${deviceInfo.browser.version}`;
  const deviceOS = `${deviceInfo.os.name} ${deviceInfo.os.version}`;

  const loginTime = new Date().toLocaleString();
  console.log(`Successful login: ${checkEmail.email}, (${checkEmail.firstName} ${checkEmail.lastName}) on ${deviceType} (OS: ${deviceOS}) (Browser: ${deviceBrowser}) at ${loginTime}`);

  // Send login notification email
  await sendMail({
    email: checkEmail.email,
    html: generateLoginNotificationEmail(
      checkEmail.firstName,
      loginTime,
      deviceType,
      deviceOS,
      deviceBrowser
    ),
    subject: "Login Notification",
  });

    // If login is successful
    const { password: _, ...newUser } = checkEmail.toObject();

    if (checkEmail.isVerified) {
      return res.status(200).json({
        message:
          "Login Successfully! Welcome " +
          checkEmail.firstName +
          " " +
          checkEmail.lastName,
        token: token,
        user: newUser,
        device: { type: deviceType, name: deviceBrowser },
      });
    } else {
      return res.status(400).json({
        message:
          "Sorry user not verified yet. Check your mail to verify your account!",
      });
    }
  } catch (error: unknown) {
    // Type guard to check if the error is an instance of Error
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error: " + error.message,
      });
    }

    // Fallback for unexpected error types
    return res.status(500).json({
      message: "Internal Server Error: An unexpected error occurred.",
    });
  }
};

//Function to help user, incase password is forgotten
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { error } = validateEmail(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Please enter your email address!",
      });
    }

    const user = await getUserByEmail(email.toLowerCase());
    if (!user) return res.status(404).json({ message: "Email does not exist" });

    const subject = "Kindly Reset Your Password";
    const link = `${req.protocol}://${req.get("host")}/api/v1/reset-password/${
      user._id
    }`;
    const html = resetFunc(user.email, link);
    sendMail({
      email: user.email,
      html,
      subject,
    });

    const newToken = jwt.sign(
      { userId: user._id },
      process.env.SECRET as string,
      { expiresIn: "900s" }
    );
    user.token = newToken;
    await user.save();

    return res.status(200).json({
      message: "Kindly check your email to reset your password",
    });
  } catch (error: unknown) {
    // Type guard to check if the error is an instance of Error
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error: " + error.message,
      });
    }

    // Fallback for unexpected error types
    return res.status(500).json({
      message: "Internal Server Error: An unexpected error occurred.",
    });
  }
};

// Function to reset the user's password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { error } = validateResetPassword(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Extract userId from request parameters and passwords from request body
    const { id } = req.params;
    const { password, confirmPassword } = req.body;

    // Check if password or confirmPassword are empty
    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "Password and Confirm Password cannot be empty",
      });
    }

    // Find the user by email
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: "user not found" });

    //Check if the link is valid or has expired
    jwt.verify(
      user.token,
      process.env.SECRET as string,
      async (err, decoded) => {
        if (err) {
          // If token is invalid/expired
          return res
            .status(400)
            .json({ message: "Link has expired!" + err.message });
        } else {
          // Check if password and confirmPassword match
          if (password !== confirmPassword) {
            return res.status(400).json({
              message: "Passwords do not match",
            });
          }

          // If the user already has a password, check if the new password is the same as the old password
          if (user.password && bcrypt.compareSync(password, user.password)) {
            return res
              .status(400)
              .json({ message: "Can't use previous password!" });
          }

          // Generate a salt and hash the new password
          const salt = bcrypt.genSaltSync(12);
          const hashPassword = bcrypt.hashSync(password, salt);
          const userId = user._id;
          // Update the user password with the new hashed password
          const updatedUser = await updateUserById(
            userId,
            { password: hashPassword },
            { new: true }
          );
          if (!updatedUser)
            return res
              .status(400)
              .json({ message: "Unable to reset user's password" });

          // Send a successful reset response
          // return res.send(resetSuccessfulHTML(req));
          return res
            .status(200)
            .json({ message: "Password reset successful!" });
        }
      }
    );
  } catch (error: unknown) {
    // Type guard to check if the error is an instance of Error
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error: " + error.message,
      });
    }

    // Fallback for unexpected error types
    return res.status(500).json({
      message: "Internal Server Error: An unexpected error occurred.",
    });
  }
};

// Function to signOut a Merchant
export const signOut = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Extract the user ID from the request object
    const id = req.user?.userId; 
    if (!id) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: "user not found" });

    user.token = "";
    await user.save();

    const name = `${user.firstName} ${user.lastName}`

    return res.status(201).json({
      message: `${toTitleCase(name)} has been signed out successfully`,
    });
  } catch (error: unknown) {
    // Type guard to check if the error is an instance of Error
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error: " + error.message,
      });
    }

    // Fallback for unexpected error types
    return res.status(500).json({
      message: "Internal Server Error: An unexpected error occurred.",
    });
  }
};


// Get a user
export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.user;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    // Exclude the password, otp etc
    const { password: _, ...userDetails } = user.toObject();

    return res.status(200).json({
      message: "user Profile successfully fetched!",
      data: userDetails,
    });
  } catch (error) {
    // Type guard to check if the error is an instance of Error
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error: " + error.message,
      });
    }

    // Fallback for unexpected error types
    return res.status(500).json({
      message: "Internal Server Error: An unexpected error occurred.",
    });
  }
};

// get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers().sort({ createdAt: -1 }).select("-password");
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({
      message: `${users.length} user(s) found`,
      data: users,
    });
  } catch (error: unknown) {
    // Type guard to check if the error is an instance of Error
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error: " + error.message,
      });
    }

    // Fallback for unexpected error types
    return res.status(500).json({
      message: "Internal Server Error: An unexpected error occurred.",
    });
  }
};



export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { error } = validateUpdatedUser(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { userId } = req.user;
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });


    const userData = {
      firstName: req.body.firstName?.toLowerCase().trim() || user.firstName,
      lastName: req.body.lastName?.toLowerCase().trim() || user.lastName,
      email: req.body.email?.toLowerCase().trim() || user.email,
      role: req.body.role?.toLowerCase().trim() || user.role,
    }

    const updatedUser = await updateUserById(userId, userData, {new: true});
    if (!updatedUser) return res.status(400).json({ message: "Unable to update user profile!" });

    // Respond with success message and updated profile data
    return res.status(200).json({
        message: "Your profile has been updated successfully",
        data: updatedUser
    });

  } catch (error: unknown) {
    // Type guard to check if the error is an instance of Error
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error: " + error.message,
      });
    }

    // Fallback for unexpected error types
    return res.status(500).json({
      message: "Internal Server Error: An unexpected error occurred.",
    });
  }
};


export const deleteUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);
    if (!user) return res.status(404).json({message: "User not found"});

    const deleteduser = await deleteUserById(id);
    if (!deleteduser) return res.status(400).json({message: "Unable to delete user profile"});

    return res.status(200).json({ message: "User profile successfully deleted!" });

  } catch (error: unknown) {
    // Type guard to check if the error is an instance of Error
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error: " + error.message,
      });
    }

    // Fallback for unexpected error types
    return res.status(500).json({
      message: "Internal Server Error: An unexpected error occurred.",
    });
  }
};