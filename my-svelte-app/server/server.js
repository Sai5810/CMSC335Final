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
  date: { type: Date },
  location: String,
  gameType: String,
  buyIn: Number,
  cashOut: Number,
  duration: Number,
  notes: String
});
const Session = mongoose.model('Session', sessionSchema);
const sessionRouter = express.Router();
sessionRouter.post('/', async (req, res) => {
  try {
    const session = new Session({
      ...req.body,
      date: new Date(req.body.date)
    });
    await session.save();
    res.status(201).send({ message: 'Session saved!' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
sessionRouter.get('/', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

sessionRouter.delete('/:id', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.send({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
app.use('/sessions', sessionRouter);
const statsRouter = express.Router();
statsRouter.get('/', async (req, res) => {
  try {
    const sessions = await Session.find();
    const totalSessions = sessions.length;

    if (totalSessions === 0) {
      return res.json(null); 
    }
    const totalProfit = sessions.reduce((sum, s) => sum + (s.cashOut - s.buyIn), 0);
    const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0);
    const winningGames = sessions.filter(s => s.cashOut > s.buyIn).length;
    const hourlyRate = totalHours > 0 ? totalProfit / totalHours : 0;
    const winRate = (winningGames / totalSessions) * 100;
    const tips = [
      "Play fewer hands, but play them aggressively.",
      "Fold more often when out of position.",
      "Pay attention to your opponents' habits.",
      "Don't bluff too much at low stakes.",
      "Track your results to find leaks."
    ];
    const pokerTip = tips[Math.floor(Math.random() * tips.length)];
   res.json({
      totalSessions,
      totalProfit,
      totalHours,
      hourlyRate,
      winRate,
      winningGames,
      pokerTip
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
statsRouter.get('/chart', async (req, res) => {
  try {
    const deckResponse = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const deckId = deckResponse.data.deck_id;

    const drawResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=5`);
    const cards = drawResponse.data.cards.map(card => ({
      image: card.image,
      value: card.value,
      suit: card.suit
    }));
    res.json({ cards });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate poker hand: ' + err.message });
  }
});
app.use('/stats', statsRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
