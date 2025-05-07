const mongoose = require('mongoose');

// ===== MODELS =====

const sessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  location: {
    type: String,
    required: true
  },
  buyIn: {
    type: Number,
    required: true
  },
  cashOut: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,  // in hours
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  gameType: {
    type: String,
    default: 'No Limit Hold\'em'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add virtual properties for calculated fields
sessionSchema.virtual('profit').get(function() {
  return this.cashOut - this.buyIn;
});

sessionSchema.virtual('hourlyRate').get(function() {
  return this.profit / this.duration;
});

// Configure options to include virtuals when converting to JSON
sessionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
    return ret;
  }
});

// Create the model
const Session = mongoose.model('Session', sessionSchema);

// ===== CONTROLLERS =====

// Get all poker sessions
async function getAllSessions(req, res) {
  try {
    const sessions = await Session.find().sort({ date: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get a single poker session by ID
async function getSessionById(req, res) {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Create a new poker session
async function createSession(req, res) {
  try {
    const newSession = new Session(req.body);
    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Update a poker session
async function updateSession(req, res) {
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
}

// Delete a poker session
async function deleteSession(req, res) {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get poker statistics
async function getStats(req, res) {
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
      "In tournament play, protect your stack when short and apply pressure when deep."
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
}

// Export both the model and controller functions
module.exports = {
  Session,
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getStats
};