import React, { useState } from "react";
import { useUserStore } from "../../store/store";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export const AddUser: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newUserID, setNewUserID] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [currentField, setCurrentField] = useState<
    "userID" | "username" | null
  >(null);
  const [keyboardInput, setKeyboardInput] = useState("");
  const [keyboardShift, setKeyboardShift] = useState(false);

  const users = useUserStore((state) => state.users);
  const addUser = useUserStore((state) => state.addUser);
  const deleteUser = useUserStore((state) => state.deleteUser);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const toggleModal = () => setModalOpen(!isModalOpen);

  const handleAddUser = () => {
    if (newUserID && newUsername) {
      addUser({ userID: newUserID, username: newUsername });
      setNewUserID("");
      setNewUsername("");
      closeKeyboard(); // Close keyboard when user is added
    }
  };

  const handleFieldFocus = (field: "userID" | "username") => {
    setCurrentField(field);
    setKeyboardInput(field === "userID" ? newUserID : newUsername);
    setKeyboardVisible(true);
  };

  const handleKeyboardChange = (value: string) => {
    setKeyboardInput(value);
    if (currentField === "userID") {
      setNewUserID(value);
    } else if (currentField === "username") {
      setNewUsername(value);
    }
  };

  const closeKeyboard = () => {
    setKeyboardVisible(false);
    setCurrentField(null);
  };

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
    <div className="relative">
      <button
        className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32"
        onClick={toggleDropdown}
      >
        Bruger: <br />
        {users.length > 0
          ? `${users[0].userID} ${users[0].username}`
          : "Ingen brugere"}
      </button>
      {isDropdownOpen && (
        <div className="absolute bg-white border rounded-md shadow-lg mt-2 p-4 w-52">
          <h3 className="text-black mb-2">Tilføj ny bruger</h3>
          <input
            type="text"
            placeholder="UserID"
            value={newUserID}
            onFocus={() => handleFieldFocus("userID")}
            onBlur={closeKeyboard} // Close keyboard on field blur
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Username"
            value={newUsername}
            onFocus={() => handleFieldFocus("username")}
            onBlur={closeKeyboard} // Close keyboard on field blur
            className="border p-2 w-full mb-2"
          />
          <button
            className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500 w-full"
            onClick={handleAddUser}
          >
            Tilføj bruger
          </button>
          <div className="mt-4">
            <button
              className="text-blue-500 hover:underline"
              onClick={toggleModal}
            >
              Brugere
            </button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-2 rounded-md shadow-lg w-96">
            <h4 className="text-black mb-2">Brugere:</h4>
            <ul className="list-disc list-inside">
              {users.map((user, index) => (
                <li key={index} className="flex justify-between">
                  <span>
                    {user.userID} {user.username}
                  </span>
                  <button
                    className="text-red-500 hover:underline ml-2"
                    onClick={() => deleteUser(user.userID)}
                  >
                    Slet
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={toggleModal}
            >
              Luk
            </button>
          </div>
        </div>
      )}
      {keyboardVisible && (
        <div
          className="fixed inset-x-0 bottom-0 bg-gray-100"
          style={{ height: "45vh" }}
        >
          <Keyboard
            onChange={handleKeyboardChange}
            input={keyboardInput}
            layout={danishKeyboardLayout}
            display={{
              "{space}": "Mellemrum",
              "{shift}": "Shift",
              "{backspace}": "←",
            }}
            onKeyPress={(button) => {
              if (button === "{shift}") handleShift();
            }}
          />
        </div>
      )}
    </div>
  );
};
