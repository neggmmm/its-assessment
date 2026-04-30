import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from './configuration/config.ts';
import { sequelize } from './configuration/db.config.ts';
import './modules/user/user.model.ts';
import userRouter from './modules/user/user.routes.ts';
import authRouter from './modules/auth/auth.routes.ts';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/users', userRouter);

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