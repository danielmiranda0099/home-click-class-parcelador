import { create } from "zustand";

export const useAccountingStore = create((set) => ({
  editTransaction: null,
  setEditTransaction: (editTransaction) => set({ editTransaction }),
}));
