import { create } from "zustand";
//TODO: AddNewLesson no tiene sentido
export const useLessonStore = create((set) => ({
  lessons: [],
  SetLessons: (new_lessons) =>
    set(() => ({
      lessons: new_lessons,
    })),

  selected_lesson: null,
  setSelectedLesson: (new_selected_lesson) =>
    set(() => ({
      selected_lesson: new_selected_lesson,
    })),
}));
