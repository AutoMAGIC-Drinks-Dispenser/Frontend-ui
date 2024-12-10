import { create } from "zustand";

type User = {
  userID: string;
  username: string;
};

type RFIDStore = {
  users: User[];
  lastScannedRFID: string | null;
  addUser: (user: User) => void;
  deleteUser: (userID: string) => void;
  setLastScannedRFID: (rfid: string) => void;
};

export const useUserStore = create<RFIDStore>((set) => ({
  users: [],
  lastScannedRFID: null,
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),
  deleteUser: (userID) =>
    set((state) => ({
      users: state.users.filter((user) => user.userID !== userID),
    })),
  setLastScannedRFID: (rfid) =>
    set(() => ({
      lastScannedRFID: rfid,
    })),
}));
