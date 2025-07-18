"use client";

import { useEffect, useState, useMemo } from "react";
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
  const { user_selected } = useUserStore();
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Memoiza tus filtros para que no se redefinan en cada render
  const filters = useMemo(
    () => [
      {
        value: "all",
        label: "Todas",
        color: "#6b7280",
        fn: (lesson) => true,
      },
      {
        value: "isScheduled",
        label: "Agendadas",
        color: COLORS.BLUE_BG,
        fn: (lesson) =>
          lesson.isScheduled &&
          !lesson.isConfirmed &&
          !lesson.isCanceled &&
          lesson.studentLessons.every((sl) => sl.isStudentPaid === false),
      },
      {
        value: "isScheduled-and-paid",
        label: "Agendadas y Pagas",
        color: COLORS.BLUE_BLACK_BG,
        fn: (lesson) =>
          lesson.isScheduled &&
          !lesson.isConfirmed &&
          !lesson.isCanceled &&
          lesson.studentLessons.some((sl) => sl.isStudentPaid === true),
      },
      {
        value: "isConfirmed",
        label: "Confirmadas",
        color: COLORS.PURPLE_BG,
        fn: (lesson) =>
          lesson.isConfirmed &&
          !lesson.isCanceled &&
          !lesson.isTeacherPaid &&
          !lesson.isRegistered,
      },
      {
        value: "isStudentPaid",
        label: "P.P Estudiante",
        color: COLORS.YELLOW_BG,
        fn: (lesson) =>
          lesson.isConfirmed &&
          lesson.studentLessons.some((sl) => sl.isStudentPaid === false) &&
          !lesson.isCanceled,
      },
      {
        value: "isTeacherPaid",
        label: "P.P Profesor",
        color: COLORS.ORANGE_BG,
        fn: (lesson) =>
          lesson.isConfirmed && lesson.isRegistered && !lesson.isTeacherPaid,
      },
      {
        value: "OK",
        label: "OK",
        color: COLORS.GREEN_BG,
        fn: (lesson) =>
          lesson.isConfirmed &&
          lesson.isRegistered &&
          lesson.isTeacherPaid &&
          lesson.studentLessons.every((sl) => sl.isStudentPaid),
      },
      {
        value: "isCanceled",
        label: "Canceladas",
        color: COLORS.RED_BG,
        fn: (lesson) => lesson.isCanceled,
      },
    ],
    []
  );

useEffect(() => {
  if (!lessons) return;

  const selectedFilterFn = filters.find(f => f.value === selectedFilter)?.fn ?? (() => true);

  const isTeacher = user_selected?.role?.includes("teacher");
  const isStudent = user_selected?.role?.includes("student");

  const belongsToUser = (lesson) => {
    const isStudentLesson = isStudent &&
      lesson.studentLessons.some(sl => sl.studentId === user_selected.id);

    const isTeacherLesson = isTeacher &&
      lesson.teacherId === user_selected.id;

    return isStudentLesson || isTeacherLesson;
  };

  const filteredLessons = lessons
    .filter(selectedFilterFn)
    .filter(lesson => user_selected?.id ? belongsToUser(lesson) : true);

  setLessonsFiltered(filteredLessons);
}, [selectedFilter, lessons, user_selected, filters, setLessonsFiltered]);




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
                className="w-5 h-5 rounded-full mr-2 border-gray-500 border-2"
                style={{ backgroundColor: filter.color }}
              />
              {filter.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
