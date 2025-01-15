import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  token: string;
}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      lowercase: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);


export const getUsers = () => User.find();
export const getUserByEmail = (email: string): Promise<IUser | null> => User.findOne({ email });
export const getUserById = (id: string): Promise<IUser | null> => User.findById(id);
export const createUser = async (values: Record<string, any>): Promise<IUser> => {
    const user = new User(values);
    await user.save();
    return user.toObject();
};
export const deleteUserById = (id: string) => User.findOneAndDelete({ _id: id });
export const updateUserById = (id: string | unknown, values: Record<string, any>, newOption: boolean | any) =>
    User.findOneAndUpdate({ _id: id }, values, { new: newOption });
