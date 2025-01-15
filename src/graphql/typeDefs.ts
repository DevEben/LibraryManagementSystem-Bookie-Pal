import { gql } from 'graphql-tag';

// GraphQL Schema Definition
export const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    role: String!
  }

  type Teacher {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    students: [Student]
  }

  type Student {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    teacher: Teacher!
    borrowedBooks: [Book]
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    student: Student
    publisher: String!
    publicationDate: String!
    ISBN: String!
    status: String!
  }

  type Borrow {
    id: ID!
    bookId: Book!
    student: Student!
    borrowDate: String!
    returnDate: String
    status: String!
  }

  type Query {
    users: [User!]!
    teachers: [Teacher!]!
    students: [Student!]!
    books: [Book!]!
    borrows: [Borrow!]!
    getUser(id: ID!): User
    getTeacher(id: ID!): Teacher
    getStudent(id: ID!): Student
    getBook(id: ID!): Book
    getBorrow(id: ID!): Borrow
  }

  type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!, password: String!, role: String!): User!
    createTeacher(firstName: String!, lastName: String!, email: String!): Teacher!
    createStudent(firstName: String!, lastName: String!, email: String!, teacherId: ID!): Student!
    createBook(title: String!, author: String!, publisher: String!, publicationDate: String!, ISBN: String!, status: String!): Book!
    createBorrow(bookId: ID!, studentId: ID!, borrowDate: String!, returnDate: String, status: String!): Borrow!
    updateUser(id: ID!, firstName: String, lastName: String, email: String, password: String, role: String): User!
    updateTeacher(id: ID!, firstName: String, lastName: String, email: String): Teacher!
    updateStudent(id: ID!, firstName: String, lastName: String, email: String, teacherId: ID!): Student!
    updateBook(id: ID!, title: String, author: String, publisher: String, publicationDate: String, ISBN: String, status: String): Book!
    updateBorrow(id: ID!, bookId: ID, studentId: ID, borrowDate: String, returnDate: String, status: String): Borrow!
    deleteUser(id: ID!): Boolean!
    deleteTeacher(id: ID!): Boolean!
    deleteStudent(id: ID!): Boolean!
    deleteBook(id: ID!): Boolean!
    deleteBorrow(id: ID!): Boolean!
  }
`;
