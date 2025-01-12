import { formatLessonsToDelete } from "@/utils/formatLessonsToDelete";
import { formattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";
import { create } from "zustand";

export const useActionsViewStore = create((set) => ({
  start_date: "",
  setStartDate: (start_date) => set({ start_date }),
  end_date: "",
  setEndDate: (end_date) => set({ end_date }),
  lessons_to_delete: null,
  setLessonsToDelete: (lessons) => set({ lessons_to_delete: lessons }),
  fetchLessonsToDelete: async (lessons) => {
    const lesson_to_delete_formated = formatLessonsToDelete(lessons);
    const lesson_formated_for_calendar = await formattedLessonsForCalendar(
      lesson_to_delete_formated,
      "admin"
    );
    set({ lessons_to_delete: lesson_formated_for_calendar });
  },
  teacher_selected: null,
  setTeacherSelected: (teacher_selected) => set({teacher_selected}),
  student_selected: null,
  setStudentSelected: (student_selected) => set({student_selected}),
}));
