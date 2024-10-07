import { create } from "zustand";
//TODO: Change Name file uiStores quitar la "s"
export const usePaymentViewStore = create((set) => ({
  start_date: "",
  setStartDate: (start_date) => set({ start_date }),
  end_date: "",
  setEndDate: (end_date) => set({ end_date }),
  payments: null,
  setPayments: (payments) => set({ payments }),
}));
