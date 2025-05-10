import axios from 'axios';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

const sessionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  location: String,
  gameType: { type: String, default: 'No Limit Hold\'em' },
  buyIn: Number,
  cashOut: Number,
  duration: Number,
  notes: String
}, { 
  virtuals: {
    profit: { get() { return this.cashOut - this.buyIn } },
    hourlyRate: { get() { return this.duration > 0 ? this.profit / this.duration : 0 } }
  },
  toJSON: { virtuals: true }
});

const Session = mongoose.model('Session', sessionSchema);

app.use('/sessions', express.Router()
  .post('/', async (req, res) => {
    try {
      const session = new Session({ ...req.body, date: new Date(req.body.date) });
      await session.save();
      res.status(201).json(session);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  })
  .get('/', async (_, res) => {
    try {
      res.json(await Session.find().sort({ date: -1 }));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .delete('/:id', async (req, res) => {
    try {
      const result = await Session.findByIdAndDelete(req.params.id);
      res.json(result ? { message: 'Session deleted' } : { error: 'Session not found' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
);

const POKER_TIPS = [
  "Bluff against capped ranges.",
  "Fold pre.",
  "Pay attention to your opponents' habits.",
  "Be curious about the game.",
  "Track your results to find leaks.",
  "Position is power so call 4bets cold in position",
  "Focus on good decisions, not results."
];

app.use('/stats', express.Router()
  .get('/', async (_, res) => {
    try {
      const sessions = await Session.find();
      const totalSessions = sessions.length;
      
      if (totalSessions === 0) return res.json({ 
        totalSessions: 0, totalProfit: 0, totalHours: 0, 
        hourlyRate: 0, winRate: 0, winningGames: 0,
        pokerTip: POKER_TIPS[0]
      });
      
      const totalProfit = sessions.reduce((sum, s) => sum + (s.cashOut - s.buyIn), 0);
      const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0);
      const winningGames = sessions.filter(s => s.cashOut > s.buyIn).length;
      
      res.json({
        totalSessions,
        totalProfit,
        totalHours,
        hourlyRate: totalHours > 0 ? totalProfit / totalHours : 0,
        winRate: (winningGames / totalSessions) * 100,
        winningGames,
        pokerTip: POKER_TIPS[Math.floor(Math.random() * POKER_TIPS.length)]
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .get('/chart', async (_, res) => {
    try {
      const { data: { deck_id } } = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      const { data: { cards } } = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=5`);
      
      res.json({ 
        cards: cards.map(({ image, value, suit }) => ({ image, value, suit }))
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to generate poker hand: ' + err.message });
    }
  })
);

app.listen(process.env.PORT || 3000, () => 
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);