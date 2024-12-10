// loginPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkId } from '../components/communication/api';
import { arduinoWebSocket } from '../components/communication/arduino-websocket';

export const LoginPage: React.FC = () => {
  const [error, setError] = useState('');
  const [rfidData, setRfidData] = useState<string | null>(null);
  const navigate = useNavigate();

  // Clear any existing session when the login page loads
  useEffect(() => {
    sessionStorage.removeItem('userId');
  }, []);

  useEffect(() => {
    const handleArduinoData = async (data: string) => {
      console.log('Received RFID data:', data);
      
      // Extract just the ID number from the data
      const match = data.match(/user:(\d+)/);
      if (!match) {
        console.log('Invalid data format:', data);
        return;
      }
      
      const rfid = match[1];
      setRfidData(rfid);
      
      try {
        const result = await checkId(Number(rfid));
        if (result.exists) {
          console.log('Valid ID found, navigating to main...');
          sessionStorage.setItem('userId', rfid);
          navigate('/main');
        } else {
          setError('ID ikke genkendt');
          setTimeout(() => setError(''), 3000);
        }
      } catch (err) {
        console.error('Error checking ID:', err);
        setError(err instanceof Error ? err.message : 'Der skete en fejl');
        setTimeout(() => setError(''), 3000);
      }
    };

    arduinoWebSocket.subscribe(handleArduinoData);
    return () => arduinoWebSocket.unsubscribe(handleArduinoData);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Log ind</h1>
        <p className="text-lg mb-4">
          {rfidData 
            ? `Scanning RFID: ${rfidData}` 
            : 'Waiting for RFID scan...'}
        </p>
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};