import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './configuration/config.ts';
import { sequelize } from './configuration/db.config.ts';
import userRouter from './modules/users/user.routes.ts';
import authRouter from './modules/auth/auth.routes.ts';
import examRouter from './modules/exams/exam.routes.ts';
import assignmentRouter from './modules/assignments/assignment.route.ts';
import questionRouter from './modules/questions/question.routes.ts';
import submissionRouter from './modules/submissions/submission.route.ts';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173','https://exam-its.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/exams', examRouter);
app.use('/questions', questionRouter);
app.use('/assignments', assignmentRouter);
app.use('/submissions', submissionRouter);

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    await sequelize.sync();
    console.log('Database models synchronized');

    app.listen(config.port, () => {
      console.log(`ITS assessment on port ${config.port}`);
    });

  } catch (error) {
    console.error('❌ DB connection failed:', error);
  }
}

start();
