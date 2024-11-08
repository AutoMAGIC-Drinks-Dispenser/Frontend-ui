import { SpejlaegButtonComponent } from "./dispense_button";
import { HeaderComponent } from "./header.tsx";
import { ExtraMenu } from "./extra_menu.tsx";

export const MainMenu: React.FC = () => {
  return (
    <div className="bg-white-200 h-screen w-screen flex flex-col justify-center items-center overflow-hidden">
      <HeaderComponent />
      <ExtraMenu />
      <SpejlaegButtonComponent />
    </div>
  );
};
