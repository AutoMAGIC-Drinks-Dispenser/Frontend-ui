import { useState } from "react";

export const WebSerialCommunication: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/arduino/connect', {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Failed to connect to Arduino');
      
      setIsConnected(true);
      setError('');
    } catch (err) {
      setError('Could not connect to Arduino');
      console.error('Connection error:', err);
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/arduino/disconnect', {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Failed to disconnect from Arduino');
      
      setIsConnected(false);
      setError('');
    } catch (err) {
      setError('Could not disconnect from Arduino');
      console.error('Disconnection error:', err);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
          onClick={handleConnect}
        >
          Connect Arduino
        </button>
      ) : (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded mb-4 hover:bg-red-600"
          onClick={handleDisconnect}
        >
          Disconnect Arduino
        </button>
      )}
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
};