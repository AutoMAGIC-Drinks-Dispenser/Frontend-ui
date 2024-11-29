// loginPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkId } from '../components/communication/api';

export const LoginPage: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const TEST_RFID = "1"; // Hardcoded test RFID

  useEffect(() => {
    const checkRFID = async () => {
      try {
        const result = await checkId(Number(TEST_RFID));
        if (result.exists) {
          sessionStorage.setItem('userId', TEST_RFID);
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

    // Simuler en kort forsinkelse før login for at vise login siden
    setTimeout(checkRFID, 1000);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Log ind</h1>
        <p className="text-lg mb-4">Test mode - Simulerer RFID scan med ID: {TEST_RFID}</p>
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};