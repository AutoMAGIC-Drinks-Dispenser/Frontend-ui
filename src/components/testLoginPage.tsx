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
    // This function handles the data in your login page
    const handleArduinoData = async (data: string) => {
      console.log('Raw data received in LoginPage:', data);
      
      try {
        // Extract user ID from the formatted string (user:1234)
        const userId = data.split(':')[1];
        console.log('Extracted user ID:', userId);
        
        if (!userId) {
          console.error('No user ID found in data:', data);
          return;
        }

        setRfidData(userId);
        
        try {
          console.log('Checking ID:', userId);
          const result = await checkId(Number(userId));
          console.log('Check ID result:', result);
          
          if (result.exists) {
            console.log('Valid ID found, navigating to main...');
            sessionStorage.setItem('userId', userId);
            navigate('/main');
          } else {
            console.log('ID not recognized');
            setError('ID ikke genkendt');
            setTimeout(() => setError(''), 3000);
          }
        } catch (err) {
          console.error('Error checking ID:', err);
          setError(err instanceof Error ? err.message : 'Der skete en fejl');
          setTimeout(() => setError(''), 3000);
        }
      } catch (error) {
        console.error('Error processing Arduino data:', error);
      }
    };

    // Subscribe to WebSocket data
    const unsubscribe = arduinoWebSocket.subscribe(handleArduinoData);

    // Verify WebSocket connection
    fetch('http://localhost:3000/api/arduino/status')
      .then(res => res.json())
      .then(status => {
        console.log('Arduino connection status:', status);
      })
      .catch(err => {
        console.error('Failed to check Arduino status:', err);
      });

    return () => {
      console.log('Cleaning up Arduino WebSocket handler');
      unsubscribe();
    };
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