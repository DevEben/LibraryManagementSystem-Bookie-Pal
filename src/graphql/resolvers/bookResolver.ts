import { Book, IBook } from '../../models/Book';

export const bookResolvers = {
  Query: {
    books: async (): Promise<IBook[]> => await Book.find().populate('student'),
    getBook: async (_: any, { id }: { id: string }): Promise<IBook | null> => await Book.findById(id).populate('student'),
  },
  Mutation: {
    createBook: async (_: any, { title, author, publisher, publicationDate, ISBN, status }: { title: string, author: string, publisher: string, publicationDate: string, ISBN: string, status: string }): Promise<IBook> => {
      const book = new Book({ title, author, publisher, publicationDate, ISBN, status });
      await book.save();
      return book;
    },
    updateBook: async (_: any, { id, title, author, publisher, publicationDate, ISBN, status }: { id: string, title: string, author: string, publisher: string, publicationDate: string, ISBN: string, status: string }): Promise<IBook | null> => {
      return await Book.findByIdAndUpdate(id, { title, author, publisher, publicationDate, ISBN, status }, { new: true });
    },
    deleteBook: async (_: any, { id }: { id: string }): Promise<IBook | null> => {
      return await Book.findByIdAndDelete(id);
    },
  },
};
