import { formatPayments } from "@/utils/formatPayments";
import { formattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";
import { create } from "zustand";

export const usePaymentViewStore = create((set) => ({
  start_date: "",
  setStartDate: (start_date) => set({ start_date }),
  end_date: "",
  setEndDate: (end_date) => set({ end_date }),
  payments: null,
  setPayments: (new_payments) => set({ payments: new_payments }),
  fetchPayments: async (lesson_unpayments, user) => {
    const unpaid_lesson_formated = formatPayments(lesson_unpayments, user);
    const unpaid_lesson_formated_for_calendar =
      await formattedLessonsForCalendar(unpaid_lesson_formated, "admin");
    set({ payments: unpaid_lesson_formated_for_calendar });
  },
}));
