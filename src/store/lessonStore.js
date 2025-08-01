import { create } from "zustand";
import { getLessons } from "@/actions/CrudLesson";
import { formattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";
import { getMonth, getYear } from "date-fns";

export const useLessonsStore = create((set, get) => ({
  lessons: [],
  setLessons: async (date_range, forceUpdate = false) => {
    const year = getYear(date_range.startOfMonth);
    const month = getMonth(date_range.startOfMonth);
    const key = `${year}-${month}`;

    if (forceUpdate) {
      set({ loadedMonths: new Map() });
    }

    let { loadedMonths } = get();
    if (!loadedMonths.has(key) || forceUpdate) {
      loadedMonths.set(key, true);
      set({ loadedMonths: new Map(loadedMonths) });
      set({ isLoadingLessons: true });

      // Detect offset (in minutes, negative if behind UTC)
      const timezoneOffsetMinutes = new Date().getTimezoneOffset();
      const offsetInMs = timezoneOffsetMinutes * 60 * 1000;

      const data = await getLessons({ ...date_range, offsetInMs });

      if (data?.success) {
        const formatted_lessons = await formattedLessonsForCalendar(data.data);
        const { lessons } = get();
        if (!forceUpdate) {
          set({ lessons: [...lessons, ...formatted_lessons] });
          set({ lessons_filtered: [...lessons, ...formatted_lessons] });
        } else {
          set({ lessons: formatted_lessons });
          set({ lessons_filtered: formatted_lessons });
        }
      }

      set({ isLoadingLessons: false });
    }
  },
  isLoadingLessons: false,
  loadedMonths: new Map(),

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
