"use client";

import { useState, useEffect } from "react";
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
  const { lessons_filtered: lessons, setSelectedLesson } = useLessonsStore();
  const setPopupDetailLesson = useUiStore(
    (state) => state.setPopupDetailLesson
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const defaultPage = findDefaultPage();
    setCurrentPage(defaultPage);
  }, [lessons]);

  const findDefaultPage = () => {
    const now = moment();
    const upcomingLessonIndex = lessons.findIndex((lesson) =>
      moment(lesson.startDate).isAfter(now)
    );
    if (upcomingLessonIndex === -1) return 1;
    return Math.floor(upcomingLessonIndex / itemsPerPage) + 1;
  };

  const getLessonById = (id) => {
    return lessons.find((lesson) => lesson.id === id);
  };

  const handleClickEdit = (id) => {
    const lesson = getLessonById(id);
    setSelectedLesson(lesson);
    setPopupDetailLesson(true);
  };

  const indexOfLastLesson = currentPage * itemsPerPage;
  const indexOfFirstLesson = indexOfLastLesson - itemsPerPage;
  const currentLessons = lessons.slice(indexOfFirstLesson, indexOfLastLesson);

  const totalPages = Math.ceil(lessons.length / itemsPerPage);

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full mx-auto px-12 space-y-4">
      <Table className="border-gray-400 border-2 mx-auto w-full max-w-[1000px]">
        <TableHeader className="bg-slate-900">
          <TableRow className="hover:bg-current">
            <TableHead>Students</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentLessons.map((lesson, index) => (
            <TableRow
              key={lesson.id}
              className={`${index % 2 === 0 && "bg-slate-100"} hover:bg-sky-100`}
            >
              <TableCell className="min-w-48 flex flex-col">
                {lesson?.studentLessons.map((lesson) => (
                  <span key={lesson.student.email}>
                    {lesson.student.firstName} {lesson.student.lastName}
                  </span>
                ))}
              </TableCell>
              <TableCell className="min-w-48">
                {lesson.teacher.firstName.split(" ")[0]}{" "}
                {lesson.teacher.lastName.split(" ")[0]}
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
              <TableCell>{lesson.isGroup ? "Grupal" : "Individual"}</TableCell>
              <TableCell className="min-w-32">
                {moment(lesson.startDate).format("D/M/Y")}
              </TableCell>
              <TableCell className="">
                <div className="flex items-end gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex justify-center items-center gap-2"
                    onClick={() => handleClickEdit(lesson.id)}
                  >
                    <EyeIcon />
                    ver
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center w-full max-w-[1000px] mx-auto">
        <Button onClick={goToPrevPage} disabled={currentPage === 1}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Siguiente <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
