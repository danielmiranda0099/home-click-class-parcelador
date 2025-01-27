"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLessonsStore } from "@/store/lessonStore";
import { useUiStore } from "@/store/uiStores";
import moment from "moment";
import { EyeIcon, ChevronLeft, ChevronRight } from "lucide-react";

export function TableLessons() {
  const { lessons, setSelectedLesson, isLoadingLessons, setLessons } = useLessonsStore();
  const setPopupDetailLesson = useUiStore((state) => state.setPopupDetailLesson);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Obtener parámetros actuales de la URL
  const currentMonth = parseInt(searchParams.get("month"));
  const currentYear = parseInt(searchParams.get("year"));

  // Filtrar lecciones para el mes actual
  const currentLessons = useMemo(() => {
    return lessons.filter(lesson => {
      const lessonDate = new Date(lesson.startDate);
      return (
        lessonDate.getMonth() + 1 === currentMonth &&
        lessonDate.getFullYear() === currentYear
      );
    });
  }, [lessons, currentMonth, currentYear]);

  // Navegación entre meses
  const navigateMonth = (direction) => {
    let newMonth = currentMonth;
    let newYear = currentYear;

    if (direction === 'NEXT') {
      newMonth = newMonth === 12 ? 1 : newMonth + 1;
      if (newMonth === 1) newYear++;
    } else {
      newMonth = newMonth === 1 ? 12 : newMonth - 1;
      if (newMonth === 12) newYear--;
    }

    router.push(`?month=${newMonth}&year=${newYear}`);
  };

  // Cargar lecciones cuando cambia el mes/año
  useEffect(() => {
    if (currentMonth && currentYear) {
      const startDate = new Date(currentYear, currentMonth - 1, 1);
      const endDate = new Date(currentYear, currentMonth, 0);
      setLessons({ startOfMonth: startDate, endOfMonth: endDate });
    }
  }, [currentMonth, currentYear, setLessons]);

  const handleClickShow = (id) => {
    const lesson = lessons.find((lesson) => lesson.id === id);
    setSelectedLesson(lesson);
    setPopupDetailLesson(true);
  };

  return (
    <div className="w-full mx-auto px-0 sm:px-12 space-y-4 relative">
      <div className="flex justify-between items-center">
        <Button 
          onClick={() => navigateMonth('PREV')} 
          disabled={isLoadingLessons}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <span className="font-semibold">
          {currentMonth.toString().padStart(2, '0')}/{currentYear}
        </span>

        <Button 
          onClick={() => navigateMonth('NEXT')} 
          disabled={isLoadingLessons}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="mx-auto w-full max-w-[1000px] h-[80vh] overflow-y-scroll relative">
        <Table className="border-gray-150 border-2">
          <TableHeader className="bg-slate-900 sticky top-0">
            <TableRow className="hover:bg-current">
              <TableHead>Students</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                Date <span className="text-[0.7rem]"> (D/M/A)</span>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          {currentLessons.length > 0 ? (
            <TableBody>
              {currentLessons.map((lesson, index) => (
                <TableRow
                  key={lesson.id}
                  className={`${index % 2 === 0 && "bg-slate-100"} hover:bg-sky-100`}
                >
                  <TableCell>
                    {lesson?.studentLessons.map((studentLesson) => (
                      <span key={studentLesson.student.email}>
                        {studentLesson.student.shortName}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>{lesson.teacher.shortName}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div
                            className="min-w-7 h-7 rounded-full"
                            style={{ backgroundColor: lesson?.background }}
                          ></div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="p-3 font-bold">{lesson.lesson_status}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{lesson.isGroup ? "Grupal" : "Individual"}</TableCell>
                  <TableCell>{moment(lesson.startDate).format("D/M/YYYY")}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleClickShow(lesson.id)}>
                      <EyeIcon className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  {isLoadingLessons ? "Loading..." : "No hay clases programadas."}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
}