import { create } from "zustand";
import { getLessons } from "@/actions/CrudLesson";
import { formattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";

export const useLessonsStore = create((set) => ({
  lessons: [],
  setLessons: async (rol, date_range) => {
    const data = await getLessons(date_range);
    if (data?.success) {
      const formatted_lessons = await formattedLessonsForCalendar(
        data.data,
        rol
      );
      set({ lessons: formatted_lessons });
      set({ lessons_filtered: formatted_lessons });
    }
  },

  lessons_filtered: [],
  setLessonsFiltered: (new_lessons) =>
    set(() => ({
      lessons_filtered: new_lessons,
    })),

  selected_lesson: null,
  setSelectedLesson: (new_selected_lesson) =>
    set(() => ({
      selected_lesson: new_selected_lesson,
    })),
}));
