"use client";
import { MoreHorizontal, Pencil, Calendar, EyeIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLessonStore } from "@/store/lessonStore";
import { useUiStore } from "@/store/uiStores";
import moment from "moment";
import { EyeOpenIcon } from "./icons";
import { statusLesson } from "@/utils/formattedLessonsForCalendar";

export function TableLessons() {
  const lessons = useLessonStore((state) => state.lessons);
  const SetLessons = useLessonStore((state) => state.SetLessons);
  const setSelectedLesson = useLessonStore((state) => state.setSelectedLesson);
  const setPopupDetailLesson = useUiStore(
    (state) => state.setPopupDetailLesson
  );
  const setPoppupFormLesson = useUiStore((state) => state.setPopupFormLesson);
  const setPopupFormLessonState = useUiStore(
    (state) => state.setPopupFormLessonState
  );

  const getLessonById = (id) => {
    return lessons.find((lesson) => lesson.id === id);
  };

  const handleClickEdit = (id) => {
    const lesson = getLessonById(id);
    setSelectedLesson(lesson);
    setPopupDetailLesson(true);
  };

  const handleClickReschedule = (id) => {
    const lesson = getLessonById(id);
    setSelectedLesson(lesson);
    setPopupDetailLesson(false);
    setPopupFormLessonState("RESCHEDULE");
    setPoppupFormLesson(true);
  };

  const handleStudentPayment = (id) => {};

  const handleTeacherPayment = (id) => {};
  return (
    <div className="container mx-auto py-10">
      <Table className="border-gray-400 border-2 w-fit mx-auto">
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
          {lessons?.map((lesson, index) => (
            <TableRow key={lesson.id}>
              <TableCell className="w-48">
                <div className="flex flex-col space-x-1">
                  {
                    lesson.student.firstName.split(" ")[0] +
                      " " +
                      lesson.student.lastName.split(" ")[0]
                    //   .slice(0, 2).map((student, index) => (
                    //     <span key={index}>
                    //       {student}
                    //       {index < 1 && lesson.students.length > 1 ? "," : ""}
                    //     </span>
                    //   ))
                  }
                  {/* {lesson.students.length > 2 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {lesson.students.slice(2).map((student, index) => (
                                <DropdownMenuItem key={index}>
                                  {student}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TooltipTrigger>
                        <TooltipContent>View more students</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )} */}
                </div>
              </TableCell>
              <TableCell className="w-48">
                {lesson.teacher.firstName.split(" ")[0]}{" "}
                {lesson.teacher.lastName.split(" ")[0]}
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className="w-7 h-7 rounded-full"
                        style={{ backgroundColor: lesson?.background }}
                      ></div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="p-3 font-bold">
                        {statusLesson(lesson, "admin")[2]}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{lesson.isGroup ? "Grupal" : "Individual"}</TableCell>
              <TableCell className="w-32">
                {moment(lesson.startDate).format("D/M/Y")}
              </TableCell>
              <TableCell className="bg-white">
                <div className="flex items-end gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className=""
                    onClick={() => handleClickEdit(lesson.id)}
                  >
                    <EyeIcon className="h-6 w-6 mr-2" />
                    ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className=""
                    onClick={() => {
                      handleClickReschedule(lesson.id);
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Reschedule
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
