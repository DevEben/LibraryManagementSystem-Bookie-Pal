import { Teacher, ITeacher } from '../../models/Teacher';

export const teacherResolvers = {
  Query: {
    teachers: async (): Promise<ITeacher[]> => await Teacher.find(),
    getTeacher: async (_: any, { id }: { id: string }): Promise<ITeacher | null> => await Teacher.findById(id),
  },
  Mutation: {
    createTeacher: async (_: any, { firstName, lastName, email }: { firstName: string, lastName: string, email: string }): Promise<ITeacher> => {
      const teacher = new Teacher({ firstName, lastName, email });
      await teacher.save();
      return teacher;
    },
    updateTeacher: async (_: any, { id, firstName, lastName, email }: { id: string, firstName: string, lastName: string, email: string }): Promise<ITeacher | null> => {
      return await Teacher.findByIdAndUpdate(id, { firstName, lastName, email }, { new: true });
    },
    deleteTeacher: async (_: any, { id }: { id: string }): Promise<ITeacher | null> => {
      return await Teacher.findByIdAndDelete(id);
    },
  },
};
