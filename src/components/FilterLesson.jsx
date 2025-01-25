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
import { useLessonsStore } from "@/store/lessonStore";
import { useUserStore } from "@/store/userStore";

export function FilterLesson({ isDisabled }) {
  const { lessons, setLessonsFiltered } = useLessonsStore();
  const { user_selected: user } = useUserStore();
  const [selectedFilter, setSelectedFilter] = useState("all");

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
      filter: {
        isConfirmed: true,
        isCanceled: false,
        isTeacherPaid: false,
        isRegistered: false,
      },
    },
    {
      value: "isStudentPaid",
      label: "P.P Estudiante",
      color: COLORS.YELLOW_BG,
      filter: { isConfirmed: true, isCanceled: false },
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
      const selectedFilterObj = filters.find((f) => f.value === selectedFilter);

      const filtered = lessons.filter((lesson) => {
        const matchesUser = user
          ? lesson.studentLessons.some(
              (student_lesson) => student_lesson.student?.id === user.id
            ) || lesson.teacher?.id === user.id
          : true;

        if (selectedFilterObj.value === "all") {
          return matchesUser;
        } else if (selectedFilterObj.value === "isStudentPaid") {
          // Verifica si algún estudiante no ha pagado en esta lección
          const matchesFilter = Object.entries(selectedFilterObj.filter).every(
            ([key, value]) => lesson[key] === value
          );
          const hasUnpaidStudent = lesson.studentLessons.some(
            (student_lesson) => student_lesson.isStudentPaid === false
          );
          return hasUnpaidStudent && matchesFilter && matchesUser;
        } else {
          const matchesFilter = Object.entries(selectedFilterObj.filter).every(
            ([key, value]) => lesson[key] === value
          );
          return matchesFilter && matchesUser;
        }
      });

      setLessonsFiltered(filtered);
    }
  }, [selectedFilter, lessons, user]);
  
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
