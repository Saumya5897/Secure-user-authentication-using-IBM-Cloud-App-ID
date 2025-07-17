const mongoose = require('mongoose');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const Goal = require('./models/Goal');


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


app.get('/goals', async (req, res) => {
  try {
    const allGoals = await Goal.find();
    res.json(allGoals);
  } catch (err) {
    console.error('❌ Error fetching goals:', err);
    res.status(500).json({ message: 'Error fetching goals' });
  }
});

app.post('/goals', async (req, res) => {
  const { goal } = req.body;

  if (!goal || goal.trim() === '') {
    return res.status(400).json({ message: 'Goal text is required!' });
  }

  try {
    const newGoal = await Goal.create({
      text: goal.trim(),
    });

    res.status(201).json({ message: 'Goal added successfully', data: newGoal });
  } catch (err) {
    console.error('❌ Error saving goal:', err);
    res.status(500).json({ message: 'Error saving goal' });
  }
});

app.delete('/goals/:id', async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting goal:', err);
    res.status(500).json({ message: 'Error deleting goal' });
  }
});


app.put('/goals/:id', async (req, res) => {
  const { text } = req.body;

  try {
    const updated = await Goal.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating goal:', err);
    res.status(500).json({ message: 'Error updating goal' });
  }
});


app.patch('/goals/:id', async (req, res) => {
  const { completed } = req.body;

  try {
    const updated = await Goal.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Error updating completion:', err);
    res.status(500).json({ message: 'Error updating completion' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
