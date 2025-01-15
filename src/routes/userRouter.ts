import express from 'express';
import { signUp_User, verify_User, logIn_User, forgotPassword, resetPassword, signOut, getUser, getAllUsers, updateUserProfile, deleteUserProfile } from '../controllers/userController';
import { authenticate } from '../middleware/authentication';

const router = express.Router();

// Define the route
router.post('/signup', signUp_User);

//endpoint to verify a registered user
router.get('/verify-user/:id/:token', verify_User);

//endpoint to login with email
router.post("/login", logIn_User);

//endpoint for forgot password
router.post("/forgot-password", forgotPassword);

//endpoint to reset user Password
router.put('/reset-password/:id', resetPassword);

//endpoint to sign out a user
router.post("/signout", authenticate, signOut);

//endpoint to get a user profile
router.get("/get-user", authenticate, getUser);

//endpoint to get all users on the platform
router.get("/get-all", authenticate, getAllUsers);

//endpoint to update the user's profile
router.put("/update-profile", authenticate, updateUserProfile);

//endpoint to delete user profile 
router.delete("/delete-profile/:id", authenticate, deleteUserProfile);


export default router;