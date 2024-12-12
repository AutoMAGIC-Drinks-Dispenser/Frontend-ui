import { AddUser } from "./add_user";
import { CleaningButton } from "./clean_modal";

export const ExtraMenu: React.FC = () => {
  return (
    <div className="bg-stone-200 text-center py-4 w-screen flex justify-center space-x-5">
      <AddUser />
      <CleaningButton />
    </div>
  );
};
