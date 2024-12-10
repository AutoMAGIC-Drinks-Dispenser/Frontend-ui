import  { useState } from 'react';

export const RefillPremixButton = () => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    // Add your confirmation logic here
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32"
      >
        Påfyld Spejlægmix
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Bekræft påfyldning</h2>
            <p className="text-gray-700 mb-6">
              Sørg for, at alt er klar, og at Spejlægmixen er opfyldt, før du bekræfter.
            </p>
            <button
              onClick={handleConfirm}
              className="bg-blue-400 text-white px-6 py-2 rounded-md hover:bg-blue-500 focus:outline-none"
            >
              Bekræft påfyldning
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const RefillPostmixButton = () => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    // Add your confirmation logic here
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32"
      >
        Påfyld Faxekondi
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Bekræft påfyldning</h2>
            <p className="text-gray-700 mb-6">
              Sørg for, at alt er klar, og at faxekondi'en er påfyldt før du bekræfter.
            </p>
            <button
              onClick={handleConfirm}
              className="bg-blue-400 text-white px-6 py-2 rounded-md hover:bg-blue-500 focus:outline-none"
            >
              Bekræft påfyldning
            </button>
          </div>
        </div>
      )}
    </>
  );
};