import { AddUser } from "./add_user";
import { CleaningButton } from "./clean_modal";
import { RefillButton } from "./refill_modal";

export const ExtraMenu: React.FC = () => {
  return (
    <div className="bg-stone-200 text-center py-4 w-full flex justify-center space-x-20">
      <AddUser />
      <RefillButton />
      <CleaningButton />
      <button className="bg-zinc-800 text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-56">
        Afspil jingle
      </button>
    </div>
  );
};
