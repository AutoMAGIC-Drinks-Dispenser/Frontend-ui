import React, { useState } from "react";
import { useUserStore } from "../../store/store";

export const AddUser: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newUserID, setNewUserID] = useState("");
  const [newUsername, setNewUsername] = useState("");

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
    }
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
            onChange={(e) => setNewUserID(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
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
    </div>
  );
};
