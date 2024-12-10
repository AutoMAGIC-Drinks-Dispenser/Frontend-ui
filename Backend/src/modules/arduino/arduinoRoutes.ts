import express from 'express';
import { arduinoService } from './arduinoService';

const router = express.Router();

router.post('/connect', async (req, res) => {
  try {
    await arduinoService.connect();
    res.json({ message: 'Connected to Arduino' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to Arduino' });
  }
});

router.post('/disconnect', async (req, res) => {
  try {
    await arduinoService.disconnect();
    res.json({ message: 'Disconnected from Arduino' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to disconnect from Arduino' });
  }
});

// ... existing routes