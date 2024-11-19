import React, { useState } from "react";
import { SpejlaegPopupModal } from "./dispense_button_modal";

export const SpejlaegButtonComponent: React.FC = () => {
  const [showPopup, setShowPopup] = useState<"single" | "double" | null>(null);

  const handleSingleButtonClick = () => {
    setShowPopup("single");
  };

  const handleDoubleButtonClick = () => {
    setShowPopup("double");
  };

  const handleClosePopup = () => {
    setShowPopup(null);
  };

  const handleStart = () => {
    setShowPopup(null);
    // Add the logic for starting the dispensing here
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex space-x-12 p-6">
        <button
          onClick={handleSingleButtonClick}
          className="hover:bg-stone-100 focus:outline-none"
        >
          <img
            src="../../src/Images/blub.png"
            alt="Spejlæg"
            className="flex w-40 h-40"
          />
        </button>
        <button
          onClick={handleDoubleButtonClick}
          className="hover:bg-stone-100 focus:outline-none"
        >
          <img
            src="../../src/Images/blub2.png"
            alt="Double Spejlæg"
            className="flex w-40 h-40"
          />
        </button>
      </div>
      {showPopup && (
        <SpejlaegPopupModal onClose={handleClosePopup} onStart={handleStart} />
      )}
    </div>
  );
};

export default SpejlaegButtonComponent;
