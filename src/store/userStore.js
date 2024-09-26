import { GetAllUsers } from "@/actions/CrudUser";
import { create } from "zustand";

export const useUserStore = create((set) => ({
  users: [],
  setUsers: async () => {
    try {
      const all_users = await GetAllUsers();
      set({ users: all_users });
    } catch (error) {
      console.error("Error UserStore setUsers():", error);
    }
  },
  addNewUser: (new_user) =>
    set((state) => ({ users: [...state.users, new_user] })),
}));
