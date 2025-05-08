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

// ✅ FIX: Date stored as true Date object
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

// ✅ FIX: Ensure date is parsed as Date object
app.post('/sessions', async (req, res) => {
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

app.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.delete('/sessions/:id', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.send({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get('/stats', async (req, res) => {
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

app.get('/stats/chart', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: 1 });

    if (sessions.length === 0) {
      return res.json({ chartUrl: null });
    }

    const labels = [];
    const cumulative = [];
    let runningTotal = 0;

    sessions.forEach((s, i) => {
      const profit = s.cashOut - s.buyIn;
      const label = s.date.toISOString().split('T')[0]; // ✅ Ensures clean YYYY-MM-DD label
      labels.push(label);
      runningTotal += profit;
      cumulative.push(runningTotal.toFixed(2));
    });

    const chartConfig = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Cumulative Profit',
            data: cumulative,
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            fill: false,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Cumulative Profit Over Time'
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            min: 0
          }
        }
      }
    };

    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;
    res.json({ chartUrl });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
