import React, { useState } from "react";
import { SpejlaegPopupModal } from "./dispense_button_modal";
import { sendToArduino } from "./communication/api";
import { incrementAlltime } from "./communication/api";

export const SpejlaegButtonComponent: React.FC = () => {
  const [showPopup, setShowPopup] = useState<"single" | "double" | null>(null);
  const [error, setError] = useState<string>("");

  const handleSingleButtonClick = () => {
    setShowPopup("single");
  };

  const handleDoubleButtonClick = () => {
    setShowPopup("double");
  };

  const handleClosePopup = () => {
    setShowPopup(null);
    setError("");
  };

  const handleStart = async () => {
    if (showPopup) {
      try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
          setError('Du skal være logget ind for at bestille');
          return;
        }

        // Increment the alltime counter
        await incrementAlltime(Number(userId));
        
        // Send command to Arduino through backend
        await sendToArduino(showPopup);
        
        setShowPopup(null);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Der skete en fejl');
      }
    }
  };

  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex space-x-12">
        <button
          onClick={handleSingleButtonClick}
          className="hover:bg-stone-100 focus:outline-none"
        >
          <img
            src="../../src/Images/blub.png"
            alt="Spejlæg"
            className="flex w-52 h-52"
          />
        </button>
        <button
          onClick={handleDoubleButtonClick}
          className="hover:bg-stone-100 focus:outline-none"
        >
          <img
            src="../../src/Images/blub2.png"
            alt="Double Spejlæg"
            className="flex w-52 h-52"
          />
        </button>
      </div>
      {showPopup && (
        <SpejlaegPopupModal 
          onClose={handleClosePopup} 
          onStart={handleStart}
          err={error} // Pass error to modal if you want to display it there
        />
      )}
    </div>
  );
};

export default SpejlaegButtonComponent;