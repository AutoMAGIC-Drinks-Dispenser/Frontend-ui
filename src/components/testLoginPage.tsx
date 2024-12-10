// loginPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkId } from '../components/communication/api';
import { useUserStore } from '../store/store';

export const LoginPage: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { lastScannedRFID, setLastScannedRFID } = useUserStore();

  useEffect(() => {
    // Setup WebSocket connection
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'rfid') {
        setLastScannedRFID(message.data);
      }
    };

    return () => ws.close();
  }, [setLastScannedRFID]);

  useEffect(() => {
    const checkRFID = async () => {
      if (!lastScannedRFID) return;

      try {
        const result = await checkId(Number(lastScannedRFID));
        if (result.exists) {
          sessionStorage.setItem('userId', lastScannedRFID);
          navigate('/main');
        } else {
          setError('ID ikke genkendt');
          setTimeout(() => setError(''), 3000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Der skete en fejl');
        setTimeout(() => setError(''), 3000);
      }
    };

    checkRFID();
  }, [lastScannedRFID, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Log ind</h1>
        <p className="text-lg mb-4">
          {lastScannedRFID 
            ? `Sidste scannede RFID: ${lastScannedRFID}` 
            : 'Scan dit RFID kort...'}
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