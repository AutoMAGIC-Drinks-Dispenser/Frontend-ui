import React, { useState } from "react";
import { SerialPort } from "serialport";

let globalWriter: WritableStreamDefaultWriter<string> | null = null;
let globalReader: ReadableStreamDefaultReader<Uint8Array> | null = null;

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
  const [incomingData, setIncomingData] = useState<string>("");

  const requestSerialPort = async () => {
    try {
      const newPort = await (
        navigator as unknown as {
          serial: { requestPort: () => Promise<SerialPort> };
        }
      ).serial.requestPort();
      await (newPort as SerialPort).open({ baudRate: 9600 }); // Ensure baud rate matches Arduino
      setPort(newPort);

      // Set up writing to the serial port
      const textEncoder = new TextEncoderStream();
      textEncoder.readable.pipeTo(
        newPort.writable as unknown as WritableStream<Uint8Array>
      );
      globalWriter = textEncoder.writable.getWriter();

      // Set up reading from the serial port
      globalReader = (
        newPort.readable as unknown as ReadableStream<Uint8Array>
      ).getReader();

      // Start reading
      readFromArduino();

      console.log("Serial port opened successfully!");
    } catch (err) {
      console.error("Failed to open serial port:", err);
    }
  };

  const readFromArduino = async () => {
    if (!globalReader) {
      console.error("No reader available. Ensure the port is open.");
      return;
    }

    const textDecoder = new TextDecoder(); // Initialize the decoder
    let buffer = ""; // Buffer to accumulate data

    try {
      while (true) {
        const { value, done } = await globalReader.read();
        if (done) {
          console.log("Reader has been closed.");
          break;
        }
        if (value) {
          // Decode and accumulate the value
          const decodedValue = textDecoder.decode(value, { stream: true });
          buffer += decodedValue;

          // Process complete lines
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete data in the buffer

          for (const line of lines) {
            const cleanedLine = line.trim(); // Clean the line
            console.log(`Received from Arduino: ${cleanedLine}`);
            setIncomingData((prev) => prev + cleanedLine + "\n");
          }
        }
      }
    } catch (err) {
      console.error("Failed to read from Arduino:", err);
    }
  };

  const closeSerialPort = async () => {
    try {
      if (globalReader) {
        await globalReader.cancel();
        globalReader = null;
      }
      if (globalWriter) {
        await globalWriter.close();
        globalWriter = null;
      }
      if (port) {
        await (port as SerialPort).close();
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
          className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32"
          onClick={requestSerialPort}
        >
          Connect to Arduino
        </button>
      ) : (
        <button
          className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32"
          onClick={closeSerialPort}
        >
          Disconnect
        </button>
      )}
      <div className="mt-4">
        <h3 className="text-sm font-semibold">Incoming Data:</h3>
        <pre className="bg-gray-100 p-2 rounded text-xs">{incomingData}</pre>
      </div>
    </div>
  );
};
