import React from "react";

type SpejlaegButtonComponentProps = object;

const src1 = "../../src/Images/blub.png";
const src2 = "../../src/Images/blub2.png";

export const SpejlaegButtonComponent: React.FC<
  SpejlaegButtonComponentProps
> = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex space-x-8">
        <button className="focus:outline-none">
          <img src={src1} alt="Spejlæg" className="flex w-64 h-64" />
          <p className="text-center mt-4 text-lg font-semibold">Spejlæg</p>
        </button>

        <button className="focus:outline-none">
          <img src={src2} alt="Double Spejlæg" className=" flex w-96 h-64" />
          <p className="text-center mt-4 text-lg font-semibold">
            Double Spejlæg
          </p>
        </button>
      </div>
    </div>
  );
};
