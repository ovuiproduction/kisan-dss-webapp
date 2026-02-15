const express = require('express');
const Log = require('../models/Log');
const router = express.Router();

// ✅ POST /api/insert-logs – Insert a new log
router.post('/insert', async (req, res) => {
  try {
    const { farmerId, query, response } = req.body;

    if (!farmerId || !query || !response) {
      return res.status(400).json({ message: 'farmerId, query, and response are required' });
    }

    const newLog = new Log({ farmerId, query, response });
    await newLog.save();

    res.status(201).json({ message: 'Log saved successfully', log: newLog });
  } catch (error) {
    console.error('Error inserting log:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ GET /api/logs/:farmerId – Fetch all logs for a specific farmer
router.get('/get/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const logs = await Log.find({ farmerId }).sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;