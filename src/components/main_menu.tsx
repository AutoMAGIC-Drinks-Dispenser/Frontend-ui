import { SpejlaegButtonComponent } from "./dispense_button";
import { HeaderComponent } from "./header.tsx";

export const MainMenu: React.FC = () => {
  return (
    <div>
      <div>
        <HeaderComponent />
      </div>
      <SpejlaegButtonComponent />
    </div>
  );
};
