import { create } from "zustand";

type User = {
  userID: string;
  username: string;
};

type ArduinoData = {
  lastMessage: string;
  timestamp: number;
};

type Store = {
  users: User[];
  arduinoData: ArduinoData | null;
  addUser: (user: User) => void;
  deleteUser: (userID: string) => void;
  setArduinoData: (message: string) => void;
};

export const useStore = create<Store>((set) => ({
  users: [],
  arduinoData: null,
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),
  deleteUser: (userID) =>
    set((state) => ({
      users: state.users.filter((user) => user.userID !== userID),
    })),
  setArduinoData: (message) =>
    set({
      arduinoData: {
        lastMessage: message,
        timestamp: Date.now(),
      },
    }),
}));
