import React, { useState, useEffect } from "react";
import { useUserStore } from '../../store/store';
import { addUser as addUserApi, removeUser, getAllUsers } from '../../components/communication/api';

export const AddUser: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const { users, addUser, deleteUser } = useUserStore();

  // Load users from database when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Reset store before loading
        useUserStore.setState({ users: [] });
        const dbUsers = await getAllUsers();
        
        // Add unique users to store
        const uniqueUsers = Array.from(new Set(
          dbUsers.map(user => JSON.stringify({ 
            userID: user.id.toString(), 
            username: user.username 
          }))
        )).map(str => JSON.parse(str));

        uniqueUsers.forEach(user => addUser(user));
      } catch (err) {
        setError('Kunne ikke hente brugere fra databasen');
      }
    };

    loadUsers();
  }, [addUser]);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
    if (!isModalOpen) {
      refreshUsers();
    }
  };

  const refreshUsers = async () => {
    try {
      // Reset store before refreshing
      useUserStore.setState({ users: [] });
      const dbUsers = await getAllUsers();
      
      // Add unique users to store
      const uniqueUsers = Array.from(new Set(
        dbUsers.map(user => JSON.stringify({ 
          userID: user.id.toString(), 
          username: user.username 
        }))
      )).map(str => JSON.parse(str));

      uniqueUsers.forEach(user => addUser(user));
    } catch (err) {
      setError('Kunne ikke opdatere brugerlisten');
    }
  };

  const handleAddUser = async () => {
    try {
      setError("");
      if (!newUsername) {
        setError("Indtast venligst et brugernavn");
        return;
      }

      const result = await addUserApi(newUsername);
      
      // Add user to store
      addUser({
        userID: result.id.toString(),
        username: newUsername
      });

      setSuccessMessage(`Bruger ${newUsername} tilføjet med ID: ${result.id}`);
      setNewUsername("");
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Der skete en fejl');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setError("");
      await removeUser(Number(userId));
      
      // Remove user from store
      deleteUser(userId);
      
      setSuccessMessage("Bruger slettet");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Der skete en fejl');
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
            placeholder="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="border p-2 w-full mb-2"
            maxLength={10}
          />
          <button
            className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500 w-full"
            onClick={handleAddUser}
          >
            Tilføj bruger
          </button>
          
          {error && (
            <div className="mt-2 p-2 bg-red-100 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mt-2 p-2 bg-green-100 text-green-600 rounded-md text-sm">
              {successMessage}
            </div>
          )}
          
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
              {users.map((user) => (
                <li key={user.userID} className="flex justify-between">
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