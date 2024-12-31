import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import taskRouter from './api/task/taskRouter';
import errorHandler, { notFoundHandler } from './common/middleware/errorHandler';
import requestLogger from './common/middleware/requestLogger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(requestLogger);

// Rate limiting (optional)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// API routes
app.use('/api/tasks', taskRouter);

// Error handling
app.use(errorHandler());
app.use(notFoundHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
