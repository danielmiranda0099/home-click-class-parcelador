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

  popupFormNewStudent: false,
  setPopupFormNewStudent: (is_open) =>
    set(() => ({
      popupFormNewStudent: is_open,
    })),
}));
