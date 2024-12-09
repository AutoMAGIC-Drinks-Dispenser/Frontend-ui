import express from "express";
import { arduinoService } from "./arduinoService";

const router = express.Router();

router.get("/status", (req, res) => {
  res.json({
    connected: arduinoService.isConnected(),
    message: arduinoService.isConnected()
      ? "Arduino is connected"
      : "Arduino is disconnected",
  });
});

router.post("/connect", async (req, res) => {
  try {
    await arduinoService.connect();
    res.json({ success: true, message: "Arduino connected successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to connect to Arduino" });
  }
});

router.post("/disconnect", async (req, res) => {
  try {
    await arduinoService.disconnect();
    res.json({ success: true, message: "Arduino disconnected successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to disconnect Arduino" });
  }
});

router.post("/send", async (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: "Key and value are required" });
  }

  try {
    await arduinoService.sendData("DISPENSE", data);
    res.json({ success: true, message: "Data sent to Arduino successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send data to Arduino" });
  }
});

export default router;
