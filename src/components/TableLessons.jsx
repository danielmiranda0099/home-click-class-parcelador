"use client";
import { MoreHorizontal, Pencil, Calendar } from "lucide-react";
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
      <Table className="border-gray-400 border-2">
        <TableHeader className="bg-slate-900">
          <TableRow>
            <TableHead>Students</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessons.map((item, index) => (
            <TableRow
              key={item.id}
              className={`${index % 2 === 0 && "bg-gray-200"} hover:bg-cyan-50`}
            >
              <TableCell>
                <div className="flex flex-col space-x-1">
                  {
                    item.students
                    //   .slice(0, 2).map((student, index) => (
                    //     <span key={index}>
                    //       {student}
                    //       {index < 1 && item.students.length > 1 ? "," : ""}
                    //     </span>
                    //   ))
                  }
                  {/* {item.students.length > 2 && (
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
                              {item.students.slice(2).map((student, index) => (
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
              <TableCell>{item.teacher}</TableCell>
              <TableCell>status</TableCell>
              <TableCell>{item.is_group ? "Grupal" : "Individual"}</TableCell>
              <TableCell>{moment(item.start_date).format("D/M/Y")}</TableCell>
              <TableCell>
                <div className="flex items-end gap-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <Label htmlFor={`student-paid-${item.id}`}>
                      Student <br /> Payment
                    </Label>
                    <Switch id={`student-paid-${item.id}`} />
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <Label htmlFor={`teacher-paid-${item.id}`}>
                      Teacher <br /> Payment
                    </Label>
                    <Switch id={`teacher-paid-${item.id}`} />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className=""
                    onClick={() => handleClickEdit(item.id)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className=""
                    onClick={() => {
                      handleClickReschedule(item.id);
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
