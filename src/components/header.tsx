import React from "react";
import { ExtraMenu } from "./menu/extra_menu";

export const HeaderComponent: React.FC = () => {
  return (
    <div className="bg-stone-200 text-center py-4 border-b-2 border-black flex items-center">
      <ExtraMenu />
    </div>
  );
};
