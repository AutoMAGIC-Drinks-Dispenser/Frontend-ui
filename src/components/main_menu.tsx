import { SpejlaegButtonComponent } from "./dispense_button";
import { HeaderComponent } from "./header.tsx";

export const MainMenu: React.FC = () => {
  return (
    <div>
      <div>
        <HeaderComponent />
      </div>
      <img className="p-4 w-auto h-auto" src="../../src/Images/blub3.png" />
      <SpejlaegButtonComponent />
      <img />
    </div>
  );
};
