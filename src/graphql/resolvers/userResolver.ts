import { User, IUser } from '../../models/UserAuth';
import {Student} from "../../models/Student";
import {Teacher} from "../../models/Teacher";

export const userResolvers = {
  Query: {
    users: async (): Promise<IUser[]> => await User.find(),
    getUser: async (_: any, { id }: { id: string }): Promise<IUser | null> => await User.findById(id),
  },
  Mutation: {
    createUser: async (_: any, { firstName, lastName, email, password, role }: { firstName: string, lastName: string, email: string, password: string, role: string }): Promise<IUser> => {
      const user = new User({ firstName, lastName, email, password, role });
      await user.save();
      if (role === 'student') {
        const student = new Student({ firstName, lastName, email, userId: user.id });
        await student.save();
      } else if (role === 'teacher') {
        const teacher = new Teacher({ firstName, lastName, email, userId: user.id });
        await teacher.save();
      }
      return user;
    },
    updateUser: async (_: any, { id, firstName, lastName, email, password, role }: { id: string, firstName: string, lastName: string, email: string, password: string, role: string }): Promise<IUser | null> => {
      return await User.findByIdAndUpdate(id, { firstName, lastName, email, password, role }, { new: true });
    },
    deleteUser: async (_: any, { id }: { id: string }): Promise<IUser | null> => {
      return await User.findByIdAndDelete(id);
    },
  },
};
