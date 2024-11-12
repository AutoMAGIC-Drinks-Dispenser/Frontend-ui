import { SpejlaegButtonComponent } from "./dispense_button";
import { HeaderComponent } from "./header.tsx";

export const MainMenu: React.FC = () => {
  return (
    <div className="bg-white h-full w-full flex flex-col justify-center items-center overflow-hidden">
      <HeaderComponent />
      <SpejlaegButtonComponent />
    </div>
  );
};
