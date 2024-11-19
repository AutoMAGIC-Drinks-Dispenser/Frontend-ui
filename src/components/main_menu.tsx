import { SpejlaegButtonComponent } from "./dispense_button";
import { HeaderComponent } from "./header.tsx";

export const MainMenu: React.FC = () => {
  return (
    <div style={{ width: "800px", height: "480px", overflow: "hidden" }}>
      <div style={{ textAlign: "center" }}>
        <HeaderComponent />
      </div>
      <img
        className="p-4 w-auto h-auto"
        src="../../src/Images/blub3.png"
        style={{ maxWidth: "100%", maxHeight: "50%" }}
      />
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <SpejlaegButtonComponent />
      </div>
      <img style={{ display: "none" }} />
    </div>
  );
};
