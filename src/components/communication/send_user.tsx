import React, { useEffect } from "react";
import { useUserStore } from "../../store/store";
import { SerialPort } from "serialport"; // Import serialport package

export const SendUser: React.FC = () => {
  const users = useUserStore((state) => state.users);

  useEffect(() => {
    if (users.length === 0) return;

    const sendUserIDToArduino = (userID: string) => {
      serialPort.write(`${userID}\n`, (err) => {
        if (err) {
          console.error(`Error sending UserID ${userID}:`, err.message);
        } else {
          console.log(`UserID ${userID} sent successfully.`);
        }
      });
    };

    // Get the latest user
    const newUser = users[users.length - 1];

    // Send userID via UART
    sendUserIDToArduino(newUser.userID);
  });

  // UART communication setup
  const serialPort = new SerialPort({
    path: "/dev/serial0", // Adjust based on your system
    baudRate: 9600, // Match with ATmega2560 baud rate
  });

  serialPort.on("open", () => {
    console.log("Serial port open");
  });

  serialPort.on("error", (err) => {
    console.error("Serial port error:", err.message);
  });

  return null; // No UI needed
};
