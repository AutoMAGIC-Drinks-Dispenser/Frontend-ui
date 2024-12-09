interface PopupProps {
  onClose: () => void;
  onStart: () => Promise<void>;
  err: string;
}

export const SpejlaegPopupModal: React.FC<PopupProps> = ({
  onClose,
  onStart,
  err,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Bekræft Dispensing</h2>
        <div className="flex justify-around mt-8">
          <button
            onClick={onStart}
            className="bg-blue-400 text-white px-6 py-2 rounded-md hover:bg-blue-500 focus:outline-none"
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
