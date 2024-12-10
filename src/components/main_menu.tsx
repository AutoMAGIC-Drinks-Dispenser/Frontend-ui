import { SpejlaegButtonComponent } from "./dispense_button";
import { HeaderComponent } from "./header";

export const MainMenu: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeaderComponent />
      <SpejlaegButtonComponent />
    </div>
  );
};
