// loginPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkId } from './communication/api';
import { useUserStore } from '../store/store';
import { WebSerialCommunication } from './communication/web_serial_com';

export const LoginPage: React.FC = () => {
  const [error, setError] = useState('');
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const navigate = useNavigate();
  const { lastScannedRFID, setLastScannedRFID } = useUserStore();

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connectWebSocket = () => {
      ws = new WebSocket('ws://localhost:8080');
      setWsStatus('connecting');

      ws.onopen = () => {
        setWsStatus('connected');
        setError('');
      };

      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'rfid') {
            setLastScannedRFID(message.data);
            const result = await checkId(Number(message.data));
            if (result.exists) {
              sessionStorage.setItem('userId', message.data);
              navigate('/main');
            } else {
              setError('ID ikke genkendt');
              setTimeout(() => setError(''), 3000);
            }
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Der skete en fejl');
        }
      };

      ws.onerror = () => {
        setWsStatus('error');
        setError('Kunne ikke forbinde til RFID-læser');
      };

      ws.onclose = () => {
        setWsStatus('error');
        reconnectTimer = setTimeout(connectWebSocket, 5000);
      };
    };

    connectWebSocket();
    return () => {
      if (ws) ws.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [navigate, setLastScannedRFID]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Log ind</h1>
        <div className="mb-4">
          <WebSerialCommunication />
        </div>
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