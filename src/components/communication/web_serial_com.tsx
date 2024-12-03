import { useState } from "react";
import { SerialPort, ReadlineParser } from "serialport";
import { useRFIDStore } from "../../store/store";

let globalPort: SerialPort | null = null;

export const sendDataToArduino = async (data: string) => {
  if (!globalPort) {
    console.error("No serial port available. Connect to the Arduino first.");
    return;
  }

  try {
    globalPort.write(data + "\n", (err) => {
      if (err) {
        console.error("Error writing to Arduino:", err.message);
      } else {
        console.log(`Sent to Arduino: ${data}`);
      }
    });
  } catch (err) {
    console.error("Failed to send data to Arduino:", err);
  }
};

export const WebSerialCommunication: React.FC = () => {
  const [portOpen, setPortOpen] = useState(false);
  const setRFID = useRFIDStore((state) => state.setRFID);

  const connectToArduino = async () => {
    try {
      // List all available ports
      const ports = await SerialPort.list();
      console.log("Available ports:", ports);

      // Find the desired port (manually or by matching vendor/product IDs)
      const portPath = ports.find((p) => p.path)?.path; // Replace with specific port if necessary
      if (!portPath) {
        console.error("No serial ports found.");
        return;
      }

      console.log("Connecting to port:", portPath);

      // Initialize the serial port
      globalPort = new SerialPort({ path: portPath, baudRate: 9600 }, (err) => {
        if (err) {
          console.error("Error opening serial port:", err.message);
          return;
        }
        console.log("Serial port opened successfully!");
        setPortOpen(true);
      });

      // Attach a Readline parser to handle incoming data
      const parser = globalPort.pipe(new ReadlineParser({ delimiter: "\n" }));

      // Read data from the Arduino
      parser.on("data", (data) => {
        console.log("Received from Arduino:", data);
        setRFID(data.trim()); // Update Zustand store with received value
      });

      // Handle port errors
      globalPort.on("error", (err) => {
        console.error("Serial port error:", err.message);
      });

      // Handle port closure
      globalPort.on("close", () => {
        console.log("Serial port closed.");
        setPortOpen(false);
      });
    } catch (err) {
      console.error("Failed to connect to Arduino:", err);
    }
  };

  const disconnectFromArduino = () => {
    if (globalPort) {
      globalPort.close((err) => {
        if (err) {
          console.error("Error closing serial port:", err.message);
        } else {
          console.log("Serial port closed successfully.");
          setPortOpen(false);
        }
      });
      globalPort = null;
    }
  };

  return (
    <div>
      {!portOpen ? (
        <button
          className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32 h-12"
          onClick={connectToArduino}
        >
          Connect to Arduino
        </button>
      ) : (
        <button
          className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32 h-12"
          onClick={disconnectFromArduino}
        >
          Disconnect
        </button>
      )}
    </div>
  );
};
