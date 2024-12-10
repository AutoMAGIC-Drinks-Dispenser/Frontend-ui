// import { Router } from 'express';
// import { arduinoService } from './arduinoService';

// const router = Router();

// // Get Arduino connection status
// router.get('/status', (req, res) => {
//   res.json({ 
//     connected: arduinoService.isConnected(),
//     message: arduinoService.isConnected() ? 'Arduino is connected' : 'Arduino is disconnected'
//   });
// });

// // Send data to Arduino
// router.post('/send', async (req, res) => {
//   const { data } = req.body;
  
//   if (!data) {
//     return res.status(400).json({ error: 'No data provided' });
//   }

//   try {
//     await arduinoService.sendData(data);
//     res.json({ 
//       success: true, 
//       message: `Data "${data}" sent to Arduino successfully` 
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       error: error instanceof Error ? error.message : 'Failed to send data to Arduino' 
//     });
//   }
// });

// export const arduinoRouter = router;