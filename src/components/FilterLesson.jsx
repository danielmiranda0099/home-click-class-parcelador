"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { COLORS } from "@/utils/colorsStatusLesson";
import { useLessonStore } from "@/store/lessonStore";
import { useUserStore } from "@/store/userStore";

export function FilterLesson({ isDisabled }) {
  const { lessons, SetLessonsFiltered } = useLessonStore();
  const { user_selected: user } = useUserStore();
  const [selectedFilter, setSelectedFilter] = useState("all");

  // { value: "paid", label: "Pagadas", color: COLORS.GREEN_BG }, //TODO: PONER EN DB idPaid
  const filters = [
    { value: "all", label: "Todas", color: "#6b7280" },
    {
      value: "isScheduled",
      label: "Agendadas",
      color: COLORS.BLUE_BG,
      filter: { isScheduled: true, isConfirmed: false, isCanceled: false },
    },
    {
      value: "isConfirmed",
      label: "Confirmadas",
      color: COLORS.PURPLE_BG,
      filter: { isConfirmed: true, isCanceled: false, isTeacherPaid: false },
    },
    {
      value: "isStudentPaid",
      label: "P.P Estudiante",
      color: COLORS.YELLOW_BG,
      filter: { isStudentPaid: false, isConfirmed: true, isCanceled: false },
    },
    {
      value: "isTeacherPaid",
      label: "P.P Profesor",
      color: COLORS.ORANGE_BG,
      filter: { isTeacherPaid: false, isConfirmed: true },
    },
    {
      value: "isCanceled",
      label: "Canceladas",
      color: COLORS.RED_BG,
      filter: { isCanceled: true },
    },
  ];

  //TODO: llevar este effect a Calendar
  useEffect(() => {
    if (lessons && lessons.length >= 1) {
      // Encuentra el objeto de filtro correspondiente al filtro seleccionado
      const selectedFilterObj = filters.find((f) => f.value === selectedFilter);

      // Filtra las lecciones en base al filtro seleccionado o al usuario seleccionado
      const filtered = lessons.filter((lesson) => {
        // Verifica si el usuario coincide con el estudiante o profesor de la lección
        const matchesUser = user
          ? lesson.student?.id === user.id || lesson.teacher?.id === user.id
          : true;

        if (selectedFilterObj.value === "all") {
          // Si el filtro seleccionado es "all", solo filtra por usuario (si se especificó)
          return matchesUser;
        } else {
          // Verifica que todas las claves y valores en el objeto de filtro coincidan con los de la lección
          const matchesFilter = Object.entries(selectedFilterObj.filter).every(
            ([key, value]) => lesson[key] === value
          );

          // La lección debe coincidir tanto con los criterios del filtro como con el usuario (si se especificó)
          return matchesFilter && matchesUser;
        }
      });

      // Actualiza el estado con las lecciones filtradas
      SetLessonsFiltered(filtered);
    }
  }, [selectedFilter, lessons, user]); // Ejecuta el efecto cuando cambian 'selectedFilter', 'lessons' o 'user'

  return (
    <Select
      value={selectedFilter}
      onValueChange={setSelectedFilter}
      disabled={isDisabled}
    >
      <SelectTrigger className="border-gray-300 w-60">
        <Filter className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Filter options" />
      </SelectTrigger>
      <SelectContent>
        {filters.map((filter) => (
          <SelectItem key={filter.value} value={filter.value}>
            <div className="flex items-center">
              <span
                className={`w-5 h-5 rounded-full mr-2 border-gray-500 border-2`}
                style={{ backgroundColor: filter.color }}
              ></span>
              {filter.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
