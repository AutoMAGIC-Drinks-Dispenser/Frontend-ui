import React, { useState } from "react";

interface PopupProps {
  onConfirm: () => void;
}

export const RefillPopupModal: React.FC<PopupProps> = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Bekræft påfyldning</h2>
        <p className="text-gray-700 mb-6">
          Sørg for, at alt er klar, før du bekræfter.
        </p>
        <button
          onClick={onConfirm}
          className="bg-blue-400 text-white px-6 py-2 rounded-md hover:bg-blue-500 focus:outline-none"
        >
          Bekræft påfyldning
        </button>
      </div>
    </div>
  );
};

export const RefillButton: React.FC = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleOpenPopup = () => setPopupOpen(true);
  const handleConfirm = () => {
    setPopupOpen(false);
    console.log("Påfyldning bekræftet!");
  };

  return (
    <div>
      <button
        className="bg-zinc-800 text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-56"
        onClick={handleOpenPopup}
      >
        Påfyld væskebeholdere
      </button>
      {isPopupOpen && <RefillPopupModal onConfirm={handleConfirm} />}
    </div>
  );
};
