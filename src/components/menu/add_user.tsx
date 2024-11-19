import React, { useState } from "react";

export const AddUser: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<{ userID: number; username: string }[]>(
    []
  );
  const [newUserID, setNewUserID] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const toggleModal = () => setModalOpen(!isModalOpen);

  const handleAddUser = () => {
    if (newUserID && newUsername) {
      setUsers([
        ...users,
        { userID: Number(newUserID), username: newUsername },
      ]);
      setNewUserID("");
      setNewUsername("");
    }
  };

  const handleDeleteUser = (userID: number) => {
    setUsers(users.filter((user) => user.userID !== userID));
  };

  return (
    <div className="relative">
      <button
        className="bg-zinc-800 text-xs text-white px-6 py-2 rounded-md hover:bg-zinc-950 focus:outline-none w-32"
        onClick={toggleDropdown}
      >
        Bruger:{" "}
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
                    onClick={() => handleDeleteUser(user.userID)}
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
