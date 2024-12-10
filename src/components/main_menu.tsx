import React from 'react';
import { SpejlaegButtonComponent } from "./dispense_button";
import { HeaderComponent } from "./header";
import { ExtraMenu } from "./menu/extra_menu";

export const MainMenu: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeaderComponent />
      <ExtraMenu />
      <SpejlaegButtonComponent />
    </div>
  );
};
