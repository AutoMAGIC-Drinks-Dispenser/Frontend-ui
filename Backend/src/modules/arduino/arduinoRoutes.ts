// // backend/src/modules/arduino/arduinoRoutes.ts
import { Router } from 'express';
import { arduinoService } from './arduinoService';

const router = Router();

router.post('/connect', async (req, res) => {
  try {
    await arduinoService.connect();
    res.json({ success: true, message: 'Connected to Arduino' });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to connect' 
    });
  }
});

router.post('/disconnect', async (req, res) => {
  try {
    await arduinoService.disconnect();
    res.json({ success: true, message: 'Disconnected from Arduino' });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to disconnect' 
    });
  }
});

router.get('/status', (req, res) => {
  res.json({ 
    connected: arduinoService.isConnected() 
  });
});

export const arduinoRouter = router;