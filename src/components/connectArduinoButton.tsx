import React, { useState } from "react";
import { connectArduino, disconnectArduino, getArduinoStatus } from "../components/communication/api";

const ArduinoControl: React.FC = () => {
  const [status, setStatus] = useState<"connected" | "disconnected" | "unknown">("unknown");
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async () => {
    try {
      const { connected } = await getArduinoStatus();
      setStatus(connected ? "connected" : "disconnected");
    } catch (err) {
      setError("Failed to fetch Arduino status");
    }
  };

  const handleConnect = async () => {
    try {
      await connectArduino();
      setStatus("connected");
      setError(null);
    } catch (err) {
      setError("Failed to connect to Arduino");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectArduino();
      setStatus("disconnected");
      setError(null);
    } catch (err) {
      setError("Failed to disconnect Arduino");
    }
  };

  React.useEffect(() => {
    updateStatus();
  }, []);

  return (
    <div className="flex flex-col items-center mt-4">
      <h2>Arduino Status: {status}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleConnect}
        disabled={status === "connected"}
        className="bg-green-500 px-4 py-2 rounded mt-2 text-white"
      >
        Connect Arduino
      </button>
      <button
        onClick={handleDisconnect}
        disabled={status === "disconnected"}
        className="bg-red-500 px-4 py-2 rounded mt-2 text-white"
      >
        Disconnect Arduino
      </button>
    </div>
  );
};

export default ArduinoControl;
