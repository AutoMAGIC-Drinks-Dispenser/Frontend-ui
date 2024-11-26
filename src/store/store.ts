import { create } from "zustand";

type User = {
  userID: string;
  username: string;
};

type UserStore = {
  users: User[];
  addUser: (user: User) => void;
  deleteUser: (userID: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),
  deleteUser: (userID) =>
    set((state) => ({
      users: state.users.filter((user) => user.userID !== userID),
    })),
}));
