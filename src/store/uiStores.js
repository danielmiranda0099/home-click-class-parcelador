import { create } from "zustand";
//TODO: Change Name file uiStores quitar la "s"
export const useUiStore = create((set) => ({
  popupFormLesson: false,
  setPopupFormLesson: (is_open) =>
    set(() => ({
      popupFormLesson: is_open,
    })),

  popupDetailLesson: false,
  setPopupDetailLesson: (is_open) =>
    set(() => ({
      popupDetailLesson: is_open,
    })),

  isShowFooterDetailLesson: true,
  setIsShowFooterDetailLesson: (isShow) =>
    set({ isShowFooterDetailLesson: isShow }),

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

  popupFormCreateNewLesson: false,
  setPopupFormCreateNewLesson: (is_open) =>
    set(() => ({
      popupFormCreateNewLesson: is_open,
    })),

  popupFormReschedule: false,
  setPopupFormReschedule: (is_open) =>
    set(() => ({
      popupFormReschedule: is_open,
    })),

  popupFormLessonReport: false,
  setPopupFormLessonReport: (is_open) =>
    set(() => ({
      popupFormLessonReport: is_open,
    })),
}));
