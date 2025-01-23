import { create } from "zustand";
import { getLessons } from "@/actions/CrudLesson";
import { formattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";
import { getMonth, getYear } from "date-fns";

export const useLessonsStore = create((set, get) => ({
  lessons: [],
  setLessons: async (date_range, forceUpdate = false) => {
    const year = getYear(date_range.startOfMonth);
    const month = getMonth(date_range.startOfMonth);
    const key = `${year}-${month}`; // Crear una clave única basada en el año y el mes
    if (forceUpdate) {
      set({ loadedMonths: new Map() });
    }
    let { loadedMonths } = get();
    if (!loadedMonths.has(key) || forceUpdate) {
      loadedMonths.set(key, true); // Puedes guardar más datos si necesitas
      set({ loadedMonths: new Map(loadedMonths) }); // Actualizar la store
      set({ isLoadingLessons: true });
      const data = await getLessons(date_range);
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
    console.log(loadedMonths);
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
