import { AddUser } from "./add_user";

export const ExtraMenu: React.FC = () => {
  return (
    <div className="bg-stone-200 text-center py-4 w-full flex justify-end space-x-8 mr-4">
      <AddUser />
      <button className="bg-zinc-800 text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-56">
        Påfyld væskebeholdere
      </button>
      <button className="bg-zinc-800 text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-56">
        Rengør system
      </button>
      <button className="bg-zinc-800 text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-56">
        Afspil jingle
      </button>
    </div>
  );
};
