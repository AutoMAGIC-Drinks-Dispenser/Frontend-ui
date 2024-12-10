// // backend/src/modules/arduino/arduinoRoutes.ts
import { Router } from 'express';
import { arduinoService } from './arduinoService';
import { SerialPort } from 'serialport';

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

router.get('/test', async (req, res) => {
  try {
    const ports = await SerialPort.list();
    const isConnected = arduinoService.isConnected();
    
    res.json({
      availablePorts: ports,
      currentConnection: {
        isConnected,
        port: arduinoService.getCurrentPort(),
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export const arduinoRouter = router;