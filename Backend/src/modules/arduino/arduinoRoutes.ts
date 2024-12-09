import { Router } from "express";
import { arduinoService } from "./arduinoService";

const router = Router();

// Route: Check Arduino status
router.get("/status", (req, res) => {
  const connected = arduinoService.isConnected();
  res.json({
    connected,
    message: connected ? "Arduino is connected" : "Arduino is disconnected",
  });
});

// Route: Send data to Arduino
router.post("/send", async (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: "No data provided." });
  }

  try {
    await arduinoService.sendData(data);
    res.json({ success: true, message: `Data "${data}" sent to Arduino.` });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to send data.",
    });
  }
});

export const arduinoRouter = router;
