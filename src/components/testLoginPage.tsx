import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkId } from "../components/communication/api";
import { useRFIDStore } from "../store/store";
import { WebSerialCommunication } from "./communication/web_serial_com";

export const LoginPage: React.FC = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const rfid = useRFIDStore((state) => state.rfid);

  useEffect(() => {
    const checkRFID = async () => {
      if (!rfid) return; // Wait for valid RFID
      try {
        const result = await checkId(Number(rfid));
        if (result.exists) {
          sessionStorage.setItem("userId", rfid.toString());
          navigate("/main");
        } else {
          setError("ID ikke genkendt");
          setTimeout(() => setError(""), 3000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Der skete en fejl");
        setTimeout(() => setError(""), 3000);
      }
    };

    checkRFID();
  }, [rfid, navigate]);

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <WebSerialCommunication />
        <h1 className="text-2xl font-bold mb-6">Log ind</h1>
        <p className="text-lg mb-4">
          Test mode - TEST RFID scan med ID: {rfid.toString()}
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
