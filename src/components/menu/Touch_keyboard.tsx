import React, { useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

interface TouchKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export const TouchKeyboard: React.FC<TouchKeyboardProps> = ({
  value,
  onChange,
  onClose,
}) => {
  const [keyboardShift, setKeyboardShift] = useState(false);

  const handleShift = () => {
    setKeyboardShift((prev) => !prev);
  };

  const danishKeyboardLayout = keyboardShift
    ? {
        default: [
          "1 2 3 4 5 6 7 8 9 0 + @",
          "Q W E R T Y U I O P Å",
          "A S D F G H J K L Æ Ø",
          "< Z X C V B N M , . -",
          "{shift} {space} {backspace}",
        ],
      }
    : {
        default: [
          "1 2 3 4 5 6 7 8 9 0 + ´",
          "q w e r t y u i o p å",
          "a s d f g h j k l æ ø",
          "< z x c v b n m , . -",
          "{shift} {space} {backspace}",
        ],
      };

  return (
    <div
      className="fixed inset-x-0 bottom-0 bg-gray-100 keyboard-container"
      style={{ height: "46vh" }}
    >
      <Keyboard
        onChange={onChange}
        input={value}
        layout={danishKeyboardLayout}
        display={{
          "{space}": "Mellemrum",
          "{shift}": "Shift",
          "{backspace}": "←",
        }}
        onKeyPress={(button) => {
          if (button === "{shift}") handleShift();
          if (button === "{backspace}" && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
      />
      <button
        onClick={onClose}
        className="mt-2 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Luk Tastatur
      </button>
    </div>
  );
};
