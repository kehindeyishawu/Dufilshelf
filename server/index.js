import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';

const app = express();
const PORT = process.env.PORT || 5000;

// In dev the Vite proxy handles cross-origin; in prod the Vercel frontend origin must be allowed explicitly
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// Express 5 requires a 4-argument error handler to be treated as one
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
