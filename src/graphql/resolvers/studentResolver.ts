import { Student, IStudent } from '../../models/Student';

export const studentResolvers = {
  Query: {
    students: async (): Promise<IStudent[]> => await Student.find().populate('teacher'),
    getStudent: async (_: any, { id }: { id: string }): Promise<IStudent | null> => await Student.findById(id).populate('teacher'),
  },
  Mutation: {
    createStudent: async (_: any, { firstName, lastName, email, teacherId }: { firstName: string, lastName: string, email: string, teacherId: string }): Promise<IStudent> => {
      const student = new Student({ firstName, lastName, email, teacher: teacherId });
      await student.save();
      return student;
    },
    updateStudent: async (_: any, { id, firstName, lastName, email, teacherId }: { id: string, firstName: string, lastName: string, email: string, teacherId: string }): Promise<IStudent | null> => {
      return await Student.findByIdAndUpdate(id, { firstName, lastName, email, teacher: teacherId }, { new: true });
    },
    deleteStudent: async (_: any, { id }: { id: string }): Promise<IStudent | null> => {
      return await Student.findByIdAndDelete(id);
    },
  },
};
