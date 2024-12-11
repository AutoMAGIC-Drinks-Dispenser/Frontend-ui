import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkId } from './communication/api';
import { WebSerialCommunication } from './communication/web_serial_com';
import { RefillPremixButton, RefillPostmixButton } from './menu/refill_modal';

export const LoginPage: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showRefillPostmix, setShowRefillPostmix] = useState(false);
  const [showRefillPremix, setShowRefillPremix] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'rfid') {
          const rfidData = message.data;
          console.log('Received RFID:', rfidData);
          
          // Reset modal states on new RFID read
          setShowRefillPostmix(false);
          setShowRefillPremix(false);
          
          if (rfidData === "refill faxe") {
            setShowRefillPostmix(true);
          } else if (rfidData === "refill mix") {
            setShowRefillPremix(true);
          } else {
            // Check if RFID exists in database
            const result = await checkId(Number(rfidData));
            if (result.exists) {
              sessionStorage.setItem('userId', rfidData);
              navigate('/main');
            } else {
              setError('ID ikke genkendt');
              setTimeout(() => setError(''), 3000);
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Der skete en fejl');
        setTimeout(() => setError(''), 3000);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Forbindelsesfejl');
    };

    return () => {
      ws.close();
    };
  }, [navigate]);

  const handleRefillComplete = () => {
    setShowRefillPostmix(false);
    setShowRefillPremix(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Log ind</h1>
        <p className="text-lg mb-4">* Scan RFID chip *</p>
        
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        
        <WebSerialCommunication />
        
        {showRefillPostmix && (
          <RefillPostmixButton 
            initialShowModal={true}
            onComplete={handleRefillComplete}
          />
        )}
        
        {showRefillPremix && (
          <RefillPremixButton 
            initialShowModal={true}
            onComplete={handleRefillComplete}
          />
        )}
      </div>
    </div>
  );
};