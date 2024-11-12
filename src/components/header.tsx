import React from "react";
import { ExtraMenu } from "./menu/extra_menu";

export const HeaderComponent: React.FC = () => {
  return (
    <div className="bg-stone-200 text-center py-4 w-full border-b-2 border-black flex items-center">
      <h1 className="text-2xl font-extrabold text-black px-12 flex-grow whitespace-nowrap">
        AutoMAGIC Spejlægdispenser
      </h1>
      <ExtraMenu />
    </div>
  );
};
