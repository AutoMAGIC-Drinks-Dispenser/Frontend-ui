import React, { useState, useEffect } from 'react';
import { connectToArduino, disconnectFromArduino, getArduinoStatus } from '../communication/api';

export const ArduinoControl: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const status = await getArduinoStatus();
      setIsConnected(status.connected);
    } catch (err) {
      setError('Failed to check Arduino status');
    }
  };

  const handleConnect = async () => {
    try {
      await connectToArduino();
      setIsConnected(true);
      setError('');
    } catch (err) {
      setError('Failed to connect to Arduino');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectFromArduino();
      setIsConnected(false);
      setError('');
    } catch (err) {
      setError('Failed to disconnect from Arduino');
    }
  };

  return (
    <div>
      {!isConnected ? (
        <button
          className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32 h-12"
          onClick={handleConnect}
        >
          Connect Arduino
        </button>
      ) : (
        <button
          className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32 h-12"
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      )}
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}; 