import { getAllUsers, getUserSession } from "@/actions/CrudUser";
import { create } from "zustand";

export const useUserStore = create((set) => ({
  users: [],
  setUsers: async () => {
    try {
      const all_users = await getAllUsers();
      set({ users: all_users });
    } catch (error) {
      console.error("Error UserStore setUsers():", error);
    }
  },
  addNewUser: (new_user) =>
    set((state) => ({ users: [...state.users, new_user] })),
  user_selected: null,
  setuserSelected: (user) => set({ user_selected: user }),

  user_session: null,
  setUserSession: async () => {
    const data_response = await getUserSession();
    if (data_response.success) {
      set({ user_session: data_response.data });
    }
  },
}));
