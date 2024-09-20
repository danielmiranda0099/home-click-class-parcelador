import { create } from "zustand";
//TODO: Change Name file uiStores quitar la "s"
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

  popupFormConfirmClass: false,
  setPopupFormConfirmClass: (is_open) =>
    set(() => ({
      popupFormConfirmClass: is_open,
    })),

  popupFormNewUser: false,
  setPopupFormNewUser: (is_open) =>
    set(() => ({
      popupFormNewUser: is_open,
    })),

  popupFormNewLesson: false,
  setPopupFormNewLesson: (is_open) =>
    set(() => ({
      popupFormNewLesson: is_open,
    })),
}));
