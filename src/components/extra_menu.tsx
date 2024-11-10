export const ExtraMenu: React.FC = () => {
  return (
    <div className="bg-yellow-400 text-center py-4 w-full flex justify-center space-x-24">
      <div className="flex justify-item-center space-x-4">
        <span className="text-black">User: Placeholder name</span>
      </div>
      <button className="bg-stone-400 text-white px-6 py-2 rounded-md hover:bg-stone-700 focus:outline-none w-56">
        Påfyld væskebeholdere
      </button>
      <button className="bg-stone-400 text-white px-6 py-2 rounded-md hover:bg-stone-700 focus:outline-none w-56">
        Rengør system
      </button>
      <button className="bg-stone-400 text-white px-6 py-2 rounded-md hover:bg-stone-700 focus:outline-none w-56">
        Afspil jingle
      </button>
    </div>
    
  );
};
