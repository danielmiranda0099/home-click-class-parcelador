import { create } from "zustand";
import { getLessons } from "@/actions/CrudLesson";
import { formattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";

export const useLessonsStore = create((set) => ({
  lessons: [],
  isLoading: false,
  error: null,

  setLessons: async (rol = "admin") => {
    try {
      set({ isLoading: true, error: null });
      const data = await getLessons();
      const formattedLessons = formattedLessonsForCalendar(data, rol);
      set({ lessons: formattedLessons, isLoading: false });
      return formattedLessons;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
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

  createLesson: async (lessonForm) => {
    try {
      set({ isLoading: true, error: null });
      await CreateNewLeccons(lessonForm);

      const data = await getLessons();
      const formattedLessons = formattedLessonsForCalendar(data, "admin");
      set({ lessons: formattedLessons, isLoading: false });

      return formattedLessons;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  payLesson: async (lessonId, paymentData) => {
    try {
      set({ isLoading: true, error: null });
      await PayLesson([lessonId], paymentData);

      const data = await getLessons();
      const formattedLessons = formattedLessonsForCalendar(data, "admin");
      set({ lessons: formattedLessons, isLoading: false });

      return formattedLessons;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
