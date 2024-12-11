import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkId } from './communication/api';
import { WebSerialCommunication } from './communication/web_serial_com';


export const LoginPage: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showRefillPostmix, setShowRefillPostmix] = useState(false);
  const [showRefillPremix, setShowRefillPremix] = useState(false);

  // Debug function to log state changes
  const logStateChange = (stateName: string, value: boolean) => {
    console.log(`Setting ${stateName} to:`, value);
  };

  useEffect(() => {
    console.log('Current modal states:', { showRefillPostmix, showRefillPremix });
  }, [showRefillPostmix, showRefillPremix]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    console.log('WebSocket connection initialized');

    ws.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'rfid') {
          const rfidData = message.data;
          console.log('Received RFID data:', rfidData);
          
          if (rfidData === "refill faxe") {
            console.log('Attempting to show Postmix modal');
            setShowRefillPostmix(true);
            setShowRefillPremix(false);
            logStateChange('showRefillPostmix', true);
          } else if (rfidData === "refill mix") {
            console.log('Attempting to show Premix modal');
            setShowRefillPremix(true);
            setShowRefillPostmix(false);
            logStateChange('showRefillPremix', true);
          } else {
            // Reset modal states for other RFID inputs
            setShowRefillPostmix(false);
            setShowRefillPremix(false);
            
            // Check if RFID exists in database
            const result = await checkId(Number(rfidData));
            if (result.exists) {
              console.log('Valid ID found, navigating to main');
              sessionStorage.setItem('userId', rfidData);
              navigate('/main');
            } else {
              setError('ID ikke genkendt');
              setTimeout(() => setError(''), 3000);
            }
          }
        }
      } catch (err) {
        console.error('Error processing message:', err);
        setError(err instanceof Error ? err.message : 'Der skete en fejl');
        setTimeout(() => setError(''), 3000);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Forbindelsesfejl');
    };

    return () => {
      console.log('Closing WebSocket connection');
      ws.close();
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Log ind</h1>
        <p className="text-lg mb-4">* Scan RFID chip *</p>
        
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        
        <WebSerialCommunication />
        
        <div className="relative">
          {showRefillPostmix && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-md shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Bekræft påfyldning</h2>
                <p className="text-gray-700 mb-6">
                  Sørg for, at alt er klar, og at faxekondi'en er påfyldt før du bekræfter.
                </p>
                <button
                  onClick={() => setShowRefillPostmix(false)}
                  className="bg-blue-400 text-white px-6 py-2 rounded-md hover:bg-blue-500 focus:outline-none"
                >
                  Bekræft påfyldning
                </button>
              </div>
            </div>
          )}
          
          {showRefillPremix && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-md shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Bekræft påfyldning</h2>
                <p className="text-gray-700 mb-6">
                  Sørg for, at alt er klar, og at Spejlægmixen er opfyldt, før du bekræfter.
                </p>
                <button
                  onClick={() => setShowRefillPremix(false)}
                  className="bg-blue-400 text-white px-6 py-2 rounded-md hover:bg-blue-500 focus:outline-none"
                >
                  Bekræft påfyldning
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};