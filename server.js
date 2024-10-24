import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
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
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const boardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  boardOrder: { type: [Number], required: true },
  boardTasks: { type: Object, required: true }, // Store tasks as an object
});

const Task = mongoose.model('Task', taskSchema);
const Board = mongoose.model('Board', boardSchema);
const User = mongoose.model('User', signupSchema);

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token

  if (!token) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user data to request
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Route to add a new user
app.post('/signup', async (req, res) => {
  const { email, password } = req.body; 

  try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: 'Email already in use' });
      }

      const newUser = new User({ email, password });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
  } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/tasks',authenticate, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id; // Assuming you set req.user in your authentication middleware

  try {
    const newTask = new Task({ userId, title, description });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error saving task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.password !== password) {
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
    // Assuming you have a Board model that references the User model
    const existingBoard = await Board.findOne({ userId });

    if (existingBoard) {
      // Update existing boards
      existingBoard.boardOrder = boardOrder;
      existingBoard.boardTasks = boardTasks;
      await existingBoard.save();
    } else {
      // Create a new board entry
      const newBoard = new Board({
        userId,
        boardOrder,
        boardTasks,
      });
      await newBoard.save();
    }

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
    if (existingBoard) {
      res.status(200).json(existingBoard);
    } else {
      res.status(404).json({ message: 'No boards found' });
    }
  } catch (error) {
    console.error('Error retrieving boards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
