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

const boardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  boardOrder: { type: [Number], required: true },
  boardTasks: { type: Object, required: false }, // Store tasks as an object
});
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

app.post('/signup', async (req, res) => {
  let { email, password } = req.body;

  // Convert email to lowercase
  email = email.toLowerCase();

  try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: 'Email already in use' });
      }

      const newUser = new User({ email, password });
      const savedUser = await newUser.save();

      // Generate JWT
      const token = jwt.sign({ id: savedUser._id, email: savedUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Return user data and token
      res.status(201).json({ user: savedUser, token });
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
    console.log('Existing Board:', existingBoard); // Log the found board
    if (existingBoard) {
      return res.status(200).json(existingBoard);
    } else {
      // If no boards are found, create a new board for the user
      const newBoard = new Board({
        userId,
        boardOrder: [1], // Initialize with an empty board order
        boardTasks: {
          1: [{
            name: 'Click on me!',
            note: 'Welcome to your first ever task! This task is designed to help you get familiar with how our task management system works. You’ll be able to add new tasks, move them between boards, and delete them when completed. You can press enter after typing in the task name in the input field to create a new task.',
          }],
        }, // Initialize with an empty board tasks object
      });
      await newBoard.save(); // Save the new board to the database
      console.log('New board created for user ID:', userId); // Log the creation of the new board
      return res.status(201).json(newBoard); // Return the newly created board
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
