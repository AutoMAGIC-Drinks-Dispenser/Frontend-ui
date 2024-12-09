import React, { useState } from "react";
import { sendToArduinoWithCheck } from "../components/communication/api";

const DispenseButton: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDispense = async (type: "single" | "double") => {
    setError(null);
    setLoading(true);
  
    try {
      const response = await sendToArduinoWithCheck(type);
      console.log(response.message);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Dispense error:", err.message);
        setError(err.message);
      } else {
        console.error("Unknown error occurred:", err);
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => handleDispense("single")}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        Dispense Single
      </button>
      <button
        onClick={() => handleDispense("double")}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300 mt-2"
      >
        Dispense Double
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default DispenseButton;
