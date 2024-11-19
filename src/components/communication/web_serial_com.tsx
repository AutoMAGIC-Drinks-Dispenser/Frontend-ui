import React, { useState, useEffect } from "react";
import { useUserStore } from "../../store/store";
import { SerialPort } from "serialport";

export const WebSerialCommunication: React.FC = () => {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [writer, setWriter] =
    useState<WritableStreamDefaultWriter<string> | null>(null);
  const users = useUserStore((state) => state.users);

  useEffect(() => {
    if (users.length === 0 || !writer) return;

    const newUser = users[users.length - 1];
    sendUserID(newUser.userID);
  });

  const requestSerialPort = async () => {
    try {
      const newPort = await (
        navigator as unknown as {
          serial: { requestPort: () => Promise<SerialPort> };
        }
      ).serial.requestPort(); // Prompts user to select a serial port
      (newPort as SerialPort).open({ baudRate: 9600 }); // Match baud rate with the Arduino
      setPort(newPort);

      const textEncoder = new TextEncoderStream();
      textEncoder.readable.pipeTo(
        newPort.writable as unknown as WritableStream<Uint8Array>
      );
      const newWriter = textEncoder.writable.getWriter();
      setWriter(newWriter);

      console.log("Serial port opened successfully!");
    } catch (err) {
      console.error("Failed to open serial port:", err);
    }
  };

  const sendUserID = async (userID: string) => {
    if (!writer) {
      console.error("No writer available. Ensure the port is open.");
      return;
    }

    try {
      await writer.write(userID + "\n"); // Send userID followed by a newline
      console.log(`Sent UserID: ${userID}`);
    } catch (err) {
      console.error("Failed to write to serial port:", err);
    }
  };

  const closeSerialPort = async () => {
    try {
      if (writer) {
        await writer.close();
        setWriter(null);
      }
      if (port) {
        (port as SerialPort).close();
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
    </div>
  );
};
