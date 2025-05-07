require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./db');
const {Session} = require('./controllers');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES (moved from routes.js) =====

// Get all poker sessions
app.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single poker session by ID
app.get('/sessions/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new poker session
app.post('/sessions', async (req, res) => {
  try {
    const newSession = new Session(req.body);
    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a poker session
app.put('/sessions/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a poker session
app.delete('/sessions/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get poker statistics
app.get('/stats', async (req, res) => {
  try {
    const sessions = await Session.find();
    
    const totalSessions = sessions.length;
    const totalProfit = sessions.reduce((sum, session) => sum + (session.cashOut - session.buyIn), 0);
    const totalHours = sessions.reduce((sum, session) => sum + session.duration, 0);
    const hourlyRate = totalHours > 0 ? totalProfit / totalHours : 0;
    const winningGames = sessions.filter(session => session.cashOut > session.buyIn).length;
    const winRate = totalSessions > 0 ? (winningGames / totalSessions) * 100 : 0;
    
    // Poker tips array
    const POKER_TIPS = [
      "Position is power in poker. Late position gives you more information.",
      "Pay attention to stack sizes to make better decisions.",
      "Don't play tired or emotional - mental state affects decision quality.",
      "Track your results to identify leaks in your game.",
      "Focus on making good decisions, not on outcomes.",
      "In tournament play, protect your stack when short and apply pressure when deep.",
      "Remember: The goal is to make the best decision, not win every hand.",
      "Playing fewer hands but playing them aggressively is often better than playing many hands weakly."
    ];
    
    // Get a random poker tip
    const randomIndex = Math.floor(Math.random() * POKER_TIPS.length);
    const pokerTip = POKER_TIPS[randomIndex];
    
    res.json({
      totalSessions,
      totalProfit,
      hourlyRate,
      totalHours,
      winRate,
      winningGames,
      pokerTip
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Replace this in server.js
app.get('/', (req, res) => {
  // In development, redirect to the Svelte dev server
  if (process.env.NODE_ENV !== 'production') {
    res.redirect('http://localhost:5173');
  } else {
    // In production, serve the Svelte index.html
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});