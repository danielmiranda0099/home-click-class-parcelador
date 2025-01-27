"use client";

import { useState, useMemo } from "react";
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
  const { lessons_filtered: lessons, setSelectedLesson, loadedMonths } = useLessonsStore();
  const setPopupDetailLesson = useUiStore(
    (state) => state.setPopupDetailLesson
  );

  // Crear un array de meses cargados ajustando los meses (sumando 1)
  const adjustedMonths = useMemo(() => {
    return Array.from(loadedMonths.keys()).map((key) => {
      const [year, month] = key.split("-").map(Number);
      return `${year}-${month + 1}`;
    });
  }, [loadedMonths]);

  const lessonsByMonth = useMemo(() => {
    return adjustedMonths.reduce((acc, month) => {
      acc[month] = lessons.filter((lesson) => {
        const lessonMonth = moment(lesson.startDate).format("YYYY-M");
        return lessonMonth === month;
      });
      return acc;
    }, {});
  }, [adjustedMonths, lessons]);

  // Convertir las claves en un array ordenado para la paginación
  const months = useMemo(() => adjustedMonths.sort(), [adjustedMonths]);

  const [currentPage, setCurrentPage] = useState(0);
  const currentMonth = months[currentPage];
  const currentLessons = lessonsByMonth[currentMonth] || [];

  const totalPages = months.length;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleClickShow = (id) => {
    const lesson = lessons.find((lesson) => lesson.id === id);
    setSelectedLesson(lesson);
    setPopupDetailLesson(true);
  };
  console.log(currentLessons)
  return (
    <div className="w-full mx-auto px-0 sm:px-12 space-y-4 relative">
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

          {
            currentLessons?.length > 0 ? (
              <TableBody className="h-[80vh] overflow-y-scroll">
            {currentLessons.map((lesson, index) => (
              <TableRow
                key={lesson.id}
                className={`${
                  index % 2 === 0 && "bg-slate-100"
                } hover:bg-sky-100`}
              >
                <TableCell className="min-w-48 flex flex-col">
                  {lesson?.studentLessons.map((lesson) => (
                    <span key={lesson.student.email}>
                      {lesson.student.shortName}
                    </span>
                  ))}
                </TableCell>
                <TableCell className="min-w-48">
                  {lesson.teacher.shortName}
                </TableCell>
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
                <TableCell>
                  {lesson.isGroup ? "Grupal" : "Individual"}
                </TableCell>
                <TableCell className="min-w-32">
                  {moment(lesson.startDate).format("D/M/Y")}
                </TableCell>
                <TableCell className="">
                  <div className="flex items-end gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex justify-center items-center gap-2"
                      onClick={() => handleClickShow(lesson.id)}
                    >
                      <EyeIcon />
                      ver
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No hay lecciones para este mes {currentMonth}
                  </TableCell>
                </TableRow>
              </TableBody>
            )
          }
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center w-full max-w-[1000px] mx-auto">
        <Button onClick={goToPrevPage} disabled={currentPage === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        <span>
          Mes: {currentMonth || "Sin lecciones"} (Página {currentPage + 1} de{" "}
          {totalPages})
        </span>
        <Button onClick={goToNextPage} disabled={currentPage === totalPages - 1}>
          Siguiente <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
