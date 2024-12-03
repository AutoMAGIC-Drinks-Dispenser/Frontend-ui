import React, { useState } from "react";

interface PopupProps {
  onConfirm: () => void;
}

export const RefillPremixPopupModal: React.FC<PopupProps> = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Bekræft påfyldning</h2>
        <p className="text-gray-700 mb-6">
          Sørg for, at alt er klar, og at Spejlægmixen er opfyldt, før du bekræfter.
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

export const RefillPostmixPopupModal: React.FC<PopupProps> = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Bekræft påfyldning</h2>
        <p className="text-gray-700 mb-6">
          Sørg for, at alt er klar, og at faxekondi'en er påfyldt før du bekræfter.
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


