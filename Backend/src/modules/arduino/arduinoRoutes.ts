// backend/src/modules/arduino/arduinoRoutes.ts
import { Router } from 'express';
import { arduinoService } from './arduinoService';

const router = Router();

// Get Arduino connection status
router.get('/status', (req, res) => {
  res.json({ 
    connected: arduinoService.isConnected(),
    message: arduinoService.isConnected() ? 'Arduino is connected' : 'Arduino is disconnected'
  });
});


export const arduinoRouter = router;