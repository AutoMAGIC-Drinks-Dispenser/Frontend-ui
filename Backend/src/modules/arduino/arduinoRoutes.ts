import express from "express";
import { arduinoService } from "./arduinoService";

const router = express.Router();

// Get Arduino connection status
router.get("/status", (req, res) => {
  res.json({
    connected: arduinoService.isConnected(),
    message: arduinoService.isConnected()
      ? "Arduino is connected"
      : "Arduino is disconnected",
  });
});

// Connect to Arduino
router.post("/connect", async (req, res) => {
  try {
    await arduinoService.connect();
    res.json({ success: true, message: "Arduino connected successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to connect to Arduino" });
  }
});

// Disconnect from Arduino
router.post("/disconnect", async (req, res) => {
  try {
    await arduinoService.disconnect();
    res.json({ success: true, message: "Arduino disconnected successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to disconnect Arduino" });
  }
});

// Send a command to the Arduino ("single" or "double")
router.post("/send", async (req, res) => {
  const { data } = req.body;
  if (!data || !["single", "double"].includes(data)) {
    return res.status(400).json({ error: 'Invalid data. Use "single" or "double".' });
  }

  try {
    await arduinoService.sendData("DISPENSE", data);
    res.json({ success: true, message: `Command "${data}" sent to Arduino successfully.` });
  } catch (err) {
    res.status(500).json({ error: "Failed to send data to Arduino" });
  }
});

export default router;
