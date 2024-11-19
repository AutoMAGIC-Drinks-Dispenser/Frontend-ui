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
    <div className="flex items-center justify-center p-4">
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
        <SpejlaegPopupModal onClose={handleClosePopup} onStart={handleStart} />
      )}
    </div>
  );
};

export default SpejlaegButtonComponent;
