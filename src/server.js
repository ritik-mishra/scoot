const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bikeRouter = require('./routes/bikeRouter');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/bikes', bikeRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);

app.use('/', (req, res) => {
  res.json({ message: 'base route working' });
});

const port = process.env.PORT || 5000;

async function start() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined');
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();


