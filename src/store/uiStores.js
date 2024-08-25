import { create } from "zustand";

export const useUiStore = create((set) => ({
  popupFormLesson: false,
  setPopupFormLesson: (is_open) =>
    set(() => ({
      popupFormLesson: is_open,
    })),
  popupFormLessonState: "",
  // STATE:
  //   CREATE
  //   EDIT
  //   RESCHEDULE
  setPopupFormLessonState: (state) =>
    set(() => ({
      popupFormLessonState: state,
    })),

  popupDetailLesson: false,
  setPopupDetailLesson: (is_open) =>
    set(() => ({
      popupDetailLesson: is_open,
    })),
}));
