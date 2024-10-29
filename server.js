import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a simple schema and model
const signupSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String, required: true } 
});

const boardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  boardOrder: { type: [Number], required: true },
  boardTasks: { type: Object, required: false },
});

const Board = mongoose.model('Board', boardSchema);
const User = mongoose.model('User', signupSchema);

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ error: 'Invalid token' });
    } else {
      console.error('JWT verification error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};


// Function to hash password using scrypt
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hashedPassword };
};

// Function to verify password
const verifyPassword = (password, salt, hashedPassword) => {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === hashedPassword;
};

app.post('/signup', async (req, res) => {
  let { email, password } = req.body;

  // Convert email to lowercase
  email = email.toLowerCase();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const { salt, hashedPassword } = hashPassword(password);

    const newUser = new User({ email, password: hashedPassword, salt });
    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the password using the stored salt and hashed password
    const isMatch = verifyPassword(password, user.salt, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to save boards and tasks
app.post('/save-boards', authenticate, async (req, res) => {
  const { boardOrder, boardTasks } = req.body;
  const userId = req.user.id;

  try {
    const existingBoard = await Board.findOne({ userId });

    if (existingBoard) {
      existingBoard.boardOrder = boardOrder;
      existingBoard.boardTasks = boardTasks;
      await existingBoard.save();
    } else {
      const newBoard = new Board({
        userId,
        boardOrder,
        boardTasks,
      });
      await newBoard.save();
    }
    console.log('Board saved successfully');
    res.status(200).json({ message: 'Boards saved successfully' });
  } catch (error) {
    console.error('Error saving boards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to retrieve boards and tasks
app.get('/get-boards', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const existingBoard = await Board.findOne({ userId });
    console.log('Existing Board:', existingBoard); 
    if (existingBoard) {
      return res.status(200).json(existingBoard);
    } else {
      const newBoard = new Board({
        userId,
        boardOrder: [1], 
        boardTasks: {
          1: [{
            name: 'Click on me!',
            note: 'Welcome to your first ever task! This task is designed to help you get familiar with how our task management system works. You’ll be able to add new tasks, move them between boards, and delete them when completed. You can press enter after typing in the task name in the input field to create a new task.',
          }],
        }, 
      });
      await newBoard.save(); 
      console.log('New board created for user ID:', userId); 
      return res.status(201).json(newBoard);
    }
  } catch (error) {
    console.error('Error retrieving boards:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
