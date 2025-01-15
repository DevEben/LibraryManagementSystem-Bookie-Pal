import { Borrow, IBorrow } from '../../models/Borrowed';

export const borrowResolvers = {
  Query: {
    borrows: async (): Promise<IBorrow[]> => await Borrow.find().populate('bookId').populate('studentId'),
    getBorrow: async (_: any, { id }: { id: string }): Promise<IBorrow | null> => await Borrow.findById(id).populate('bookId').populate('studentId'),
  },
  Mutation: {
    createBorrow: async (_: any, { bookId, studentId, borrowDate, returnDate, status }: { bookId: string, studentId: string, borrowDate: string, returnDate: string, status: string }): Promise<IBorrow> => {
      const borrow = new Borrow({ bookId, studentId, borrowDate, returnDate, status });
      await borrow.save();
      return borrow;
    },
    updateBorrow: async (_: any, { id, bookId, studentId, borrowDate, returnDate, status }: { id: string, bookId: string, studentId: string, borrowDate: string, returnDate: string, status: string }): Promise<IBorrow | null> => {
      return await Borrow.findByIdAndUpdate(id, { bookId, studentId, borrowDate, returnDate, status }, { new: true });
    },
    deleteBorrow: async (_: any, { id }: { id: string }): Promise<IBorrow | null> => {
      return await Borrow.findByIdAndDelete(id);
    },
  },
};
