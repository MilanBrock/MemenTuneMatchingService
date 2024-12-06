// src/app.ts
import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/database';
import mainRoutes from './routes/main';
import { connectMessageQueue } from './config/messagequeue';



const app = express();
const port = process.env.PORT || 3000;

// Connect to the database if enabled
if (process.env.DATABASE_ENABLE === "1") {
  connectDB();
}

// Connect to the message queue
if (process.env.MESSAGE_QUEUE_ENABLE === "1") {
  connectMessageQueue();
}

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/matching', mainRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
