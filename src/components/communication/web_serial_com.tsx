import { useState, useEffect } from "react";
import { SerialPort } from "serialport";

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
  const [receivedData, setReceivedData] = useState<string>("");

  useEffect(() => {
    let reader: ReadableStreamDefaultReader<string> | undefined;

    const readSerialData = async () => {
      if (!port) return;
    
      try {
        const textDecoder = new TextDecoderStream();
    
        // Cast port.readable to ReadableStream<Uint8Array>
        const readableStream = port.readable as unknown as ReadableStream<Uint8Array>;
    
        // Pipe the readable stream to the TextDecoderStream
        readableStream.pipeTo(textDecoder.writable);
    
        const reader = textDecoder.readable.getReader();
    
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
    
          console.log("Received from Arduino:", value);
          setReceivedData((prev) => prev + value); // Append new data
        }
    
        reader.releaseLock();
      } catch (err) {
        console.error("Error reading serial data:", err);
      }
    };
    

    readSerialData();

    return () => {
      if (reader) {
        reader.cancel();
      }
    };
  }, [port]);

  const requestSerialPort = async () => {
    try {
      const newPort = await (
        navigator as unknown as {
          serial: { requestPort: () => Promise<SerialPort> };
        }
      ).serial.requestPort(); // Prompts user to select a serial port
      await (newPort as SerialPort).open({ baudRate: 9600 }); // Match baud rate with the Arduino
      setPort(newPort);

      const textEncoder = new TextEncoderStream();
      textEncoder.readable.pipeTo(
        newPort.writable as unknown as WritableStream<Uint8Array>
      );
      globalWriter = textEncoder.writable.getWriter();

      console.log("Serial port opened successfully!");
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
      <div>
        <h3>Received Data:</h3>
        <pre>{receivedData}</pre>
      </div>
    </div>
  );
};
