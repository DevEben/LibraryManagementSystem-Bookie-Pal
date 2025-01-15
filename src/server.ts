import express, { Request, Response, NextFunction } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import multer from "multer";
import cookieParser from "cookie-parser";
import cors from "cors";
import { typeDefs } from "./graphql/typeDefs";
import { teacherResolvers } from "./graphql/resolvers/teacherResolver";
import { studentResolvers } from "./graphql/resolvers/studentResolver";
import { bookResolvers } from "./graphql/resolvers/bookResolver";
import { userResolvers } from "./graphql/resolvers/userResolver";
import { borrowResolvers } from "./graphql/resolvers/borrowResolver";
import { connectDB } from "./config/dbConfig";
import userRoutes from './routes/userRouter';
import teacherRoutes from './routes/teacherRouter';
import studentRoutes from './routes/studentRouter';
import bookRoutes from './routes/bookRouter';
import borrowRoutes from './routes/borrowRouter';
import dotenv from "dotenv";

dotenv.config();

const app = express(); 

const corsOptions = {
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]
};

// Middleware for CORS
app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());

app.get('/', async (req: Request, res: Response): Promise<Response> => {
    return res.send("Welcome to Bookie Pal API (Library Management System) By DevEben");
});


// RESTful API Routes
app.use('/api/users', userRoutes);
app.use('/api', teacherRoutes);
app.use('/api', studentRoutes);
app.use('/api', bookRoutes);
app.use('/api', borrowRoutes);

// GraphQL Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: [userResolvers, teacherResolvers, studentResolvers, bookResolvers, borrowResolvers],
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof SyntaxError && "status" in err && (err as any).status === 400 && "body" in err) {
        res.status(400).json({ error: 'Invalid JSON' });
    } else if (err instanceof multer.MulterError) {
        // Multer-specific error
        res.status(400).json({ error: `Multer Error: ${err.message}` });
    } else {
        console.error('Internal Server Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
        next()
    }
});

const PORT = process.env.PORT || 4000;

async function initServer() {
  try {
    await apolloServer.start();
    app.use("/graphql", bodyParser.json(), expressMiddleware(apolloServer));

    // Connect to the Database
    connectDB();

    app.listen(PORT, () => {
      console.log(`Express Server is running on http://localhost:${PORT}`);
      console.log(`GraphQL Server is running on http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

// Start the server
initServer();
