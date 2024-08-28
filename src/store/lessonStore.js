import { FormattedLessons } from "@/utils/formattedLessons";
import { create } from "zustand";

export const useLessonStore = create((set) => ({
  lessons: [],
  AddNewLesson: (new_lesson, rol) =>
    set((state) => {
      const lesson_formated = FormattedLessons(new_lesson, rol);
      if (lesson_formated.length === 1) {
        console.log("Adding new lesson:", lesson_formated);
        return { lessons: [...state.lessons, lesson_formated[0]] };
      }
      return {};
    }),
  SetLessons: (new_lessons) =>
    set(() => ({
      lessons: new_lessons,
    })),

  selected_lesson: {},
  setSelectedLesson: (new_selected_lesson) =>
    set(() => ({
      selected_lesson: new_selected_lesson,
    })),
}));
