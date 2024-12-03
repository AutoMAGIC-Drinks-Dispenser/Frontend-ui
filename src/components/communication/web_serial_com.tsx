import { useState } from "react";
import { SerialPort } from "serialport";
import { useRFIDStore } from "../../store/store";

let globalWriter: WritableStreamDefaultWriter<string> | null = null;

export const sendDataToArduino = async (data: string) => {
  if (!globalWriter) {
    console.error("No serial writer available. Connect to the Arduino first.");
    return;
  }

  try {
    await globalWriter.write(data + "\n"); // Send data with a newline character
    console.log(`Sent to Arduino: ${data}`);
  } catch (err) {
    console.error("Failed to write to Arduino:", err);
  }
};

export const WebSerialCommunication: React.FC = () => {
  const [port, setPort] = useState<SerialPort | null>(null);
  const setRFID = useRFIDStore((state) => state.setRFID);

  const requestSerialPort = async () => {
    try {
      // Request serial port from the browser
      const newPort = await (
        navigator as unknown as {
          serial: { requestPort: () => Promise<SerialPort> };
        }
      ).serial.requestPort();
      await (newPort as SerialPort).open({ baudRate: 9600 }); // Ensure baud rate matches Arduino
      setPort(newPort);

      // Setup writer for sending data to Arduino
      const textEncoder = new TextEncoderStream();
      const writableStream =
        newPort.writable as unknown as WritableStream<Uint8Array>;
      textEncoder.readable.pipeTo(writableStream);
      globalWriter = textEncoder.writable.getWriter();

      // Setup reader for receiving data from Arduino
      const textDecoder = new TextDecoderStream();
      const readableStream =
        newPort.readable as unknown as ReadableStream<Uint8Array>;
      const decodedStream = readableStream.pipeThrough(textDecoder);
      const reader = decodedStream.getReader();

      console.log("Serial port opened successfully!");

      // Read loop for incoming data
      const readLoop = async () => {
        try {
          while (true) {
            const value = "rfid2251231231" + "\n";
            const { done } = await reader.read();
            if (done) {
              console.log("Stream closed.");
              break;
            }

            if (value) {
              console.log("Received from Arduino:", value);
              setRFID(value.trim()); // Update Zustand store with received value
            }
          }
        } catch (err) {
          console.error("Error reading from Arduino:", err);
        } finally {
          reader.releaseLock();
        }
      };

      readLoop();
    } catch (err) {
      console.error("Failed to open serial port:", err);
    }
  };

  const closeSerialPort = async () => {
    try {
      if (globalWriter) {
        await globalWriter.close();
        globalWriter = null;
      }
      if (port) {
        await port.close();
        setPort(null);
      }
      console.log("Serial port closed.");
    } catch (err) {
      console.error("Failed to close serial port:", err);
    }
  };

  return (
    <div>
      {!port ? (
        <button
          className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32 h-12"
          onClick={requestSerialPort}
        >
          Connect to Arduino
        </button>
      ) : (
        <button
          className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32 h-12"
          onClick={closeSerialPort}
        >
          Disconnect
        </button>
      )}
    </div>
  );
};
