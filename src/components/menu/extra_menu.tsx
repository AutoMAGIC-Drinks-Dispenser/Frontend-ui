import { WebSerialCommunication } from "../communication/web_serial_com";
import { AddUser } from "./add_user";
import { CleaningButton } from "./clean_modal";
import { RefillButton } from "./refill_modal";

export const ExtraMenu: React.FC = () => {
  return (
    <div className="bg-stone-200 text-center py-4 w-screen flex justify-center space-x-5">
      <AddUser />
      <WebSerialCommunication />
      <RefillButton />
      <CleaningButton />
      <button className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32">
        Afspil jingle
      </button>
    </div>
  );
};
