import React, { useState, useEffect } from "react";

interface TimerPopupProps {
  onClose: () => void;
  duration: number; // Timer duration in seconds
}

export const CleaningPopupModal: React.FC<TimerPopupProps> = ({
  onClose,
  duration,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer); // Cleanup on unmount or new timer start
    } else {
      onClose(); // Close popup when timer reaches 0
    }
  }, [timeLeft, onClose]);

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Skyller system</h2>
        <p className="text-gray-700 mb-6">
          Rengøring er i gang, vent venligst...
        </p>
        <div className="text-xl font-bold text-blue-500 mb-4">
          Tid tilbage: {timeLeft} sekunder
        </div>
        <div className="w-full bg-gray-300 rounded-full h-4">
          <div
            className="bg-blue-400 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export const CleaningButton: React.FC = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => setPopupOpen(false);

  return (
    <div>
      <button
        className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32"
        onClick={handleOpenPopup}
      >
        Rengør system
      </button>
      {isPopupOpen && (
        <CleaningPopupModal onClose={handleClosePopup} duration={30} />
      )}
    </div>
  );
};
