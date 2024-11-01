import { SpejlaegButtonComponent } from "./dispense_button";
import { HeaderComponent } from "./header.tsx";

export const MainMenu: React.FC = () => {
  return (
    <div className="bg-yellow-200 h-screen w-screen justify-center items-center">
      <HeaderComponent />
      <SpejlaegButtonComponent />
    </div>
  );
};
