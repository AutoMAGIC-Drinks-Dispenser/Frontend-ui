import React, { useState } from "react";

interface PopupProps {
  onClose: () => void;
  onStart: () => void;
}

const SpejlaegPopupComponent: React.FC<PopupProps> = ({ onClose, onStart }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Bekræft Dispensing</h2>
        <div className="flex justify-around mt-8">
          <button
            onClick={onStart}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none"
          >
            Start
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none"
          >
            Annullér
          </button>
        </div>
      </div>
    </div>
  );
};

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
    <div className="flex flex-col items-center justify-center h-screen w-screen overflow-hidden">
      <div className="flex space-x-12">
        <button
          onClick={handleSingleButtonClick}
          className="hover:bg-stone-100 focus:outline-none"
        >
          <img
            src="../../src/Images/blub.png"
            alt="Spejlæg"
            className="flex w-64 h-64"
          />
        </button>
        <button
          onClick={handleDoubleButtonClick}
          className="hover:bg-stone-100 focus:outline-none"
        >
          <img
            src="../../src/Images/blub2.png"
            alt="Double Spejlæg"
            className="flex w-64 h-64"
          />
        </button>
      </div>
      {showPopup && (
        <SpejlaegPopupComponent
          onClose={handleClosePopup}
          onStart={handleStart}
        />
      )}
    </div>
  );
};

export default SpejlaegButtonComponent;
