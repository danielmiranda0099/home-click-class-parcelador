import { create } from "zustand";
import { getLessons } from "@/actions/CrudLesson";
import { formattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";
import { getMonth, getYear } from "date-fns";

export const useLessonsStore = create((set, get) => ({
  lessons: [],
  setLessons: async (rol, date_range) => {
    const year = getYear(date_range.startOfMonth);
    const month = getMonth(date_range.startOfMonth);
    const key = `${year}-${month}`; // Crear una clave única basada en el año y el mes
    const { loadedMonths } = get();
    if (!loadedMonths.has(key)) {
      loadedMonths.set(key, true); // Puedes guardar más datos si necesitas
      set({ loadedMonths: new Map(loadedMonths) }); // Actualizar la store
      const data = await getLessons(date_range);
      if (data?.success) {
        const formatted_lessons = await formattedLessonsForCalendar(
          data.data,
          rol
        );
        const { lessons } = get();
        set({ lessons: [...lessons, ...formatted_lessons] });
        set({ lessons_filtered: [...lessons, ...formatted_lessons] });
      }
    }
    console.log(loadedMonths);
  },
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
