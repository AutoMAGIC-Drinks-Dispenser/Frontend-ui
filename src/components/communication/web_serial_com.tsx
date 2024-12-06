import { useState } from "react";
import { SerialPort } from "serialport";

let globalWriter: WritableStreamDefaultWriter<string> | null = null;
let globalReader: ReadableStreamDefaultReader<string> | null = null;

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
  const [receivedData, setReceivedData] = useState<string>("");

  const requestSerialPort = async () => {
    try {
      const newPort = await (
        navigator as unknown as {
          serial: { requestPort: () => Promise<SerialPort> };
        }
      ).serial.requestPort(); // Prompts user to select a serial port
      await (newPort as SerialPort).open({ baudRate: 9600 }); // Match baud rate with the Arduino
      setPort(newPort);

      // Setup writer for sending data
      const textEncoder = new TextEncoderStream();
      textEncoder.readable.pipeTo(
        newPort.writable as unknown as WritableStream<Uint8Array>
      );
      globalWriter = textEncoder.writable.getWriter();

      // Setup reader for receiving data
      const textDecoder = new TextDecoderStream();
      (newPort.readable as unknown as ReadableStream<Uint8Array>).pipeTo(
        textDecoder.writable
      );
      globalReader = textDecoder.readable.getReader();

      console.log("Serial port opened successfully!");

      // Start listening for data
      listenForData();
    } catch (err) {
      console.error("Failed to open serial port:", err);
    }
  };

  const closeSerialPort = async () => {
    try {
      if (globalReader) {
        await globalReader.cancel();
        globalReader.releaseLock();
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

  const listenForData = async () => {
    if (!globalReader) return;

    try {
      while (true) {
        const { value, done } = await globalReader.read();
        if (done) {
          console.log("Stream closed.");
          break;
        }
        if (value) {
          const received = new TextDecoder().decode(
            value as unknown as AllowSharedBufferSource
          );
          setReceivedData((prev) => prev + received);
          console.log(`Received from Arduino: ${received}`);
        }
      }
    } catch (err) {
      console.error("Error while reading from serial port:", err);
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
      {receivedData && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Received Data:</p>
          <pre className="bg-gray-100 p-2 rounded">{receivedData}</pre>
        </div>
      )}
    </div>
  );
};
