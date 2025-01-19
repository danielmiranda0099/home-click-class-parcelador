"use client";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/userStore";
import { getLessonsByFilters } from "@/actions/CrudLesson";
import { PaperSearchIcon } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { useLessonsStore } from "@/store/lessonStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUiStore } from "@/store/uiStores";
import { ErrorAlert, InputSearch } from "@/components";
import { formatUsersForInputSearch } from "@/utils/formatUsersForInputSearch";
import { useActionsViewStore } from "@/store/actionsViewStore";
import { format } from "date-fns";
import { PopupDeleteLesson } from "./popupDetailLesson/PopupDeleteLesson";

function SubmitButtonSearch() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      Buscar
    </Button>
  );
}

//TODO: Refact component
export function ActionLessons() {
  const [teachers, setTeachers] = useState(null);
  const [students, setStudents] = useState(null);

  const { users } = useUserStore();

  const [form_state_form_search, dispathFormSearch] = useFormState(
    getLessonsByFilters,
    {
      data: [],
      success: null,
      error: false,
      message: null,
    }
  );
  const [error_message_form_search, setErrorMessageFormSearch] = useState("");
  const {
    start_date,
    setStartDate,
    end_date,
    setEndDate,
    lessons_to_delete,
    fetchLessonsToDelete,
    teacher_selected,
    setTeacherSelected,
    student_selected,
    setStudentSelected,
    setLessonsToDelete,
  } = useActionsViewStore();
  const { lessons, setSelectedLesson } = useLessonsStore();
  const { user_selected: user } = useUserStore();
  const { setPopupDetailLesson, setIsShowFooterDetailLesson } = useUiStore();
  const [is_open_popup_delete, setIsOpenPopupDelete] = useState(false);

  useEffect(() => {
    if (users) {
      const teachers = formatUsersForInputSearch(
        users.filter((user) => user.role.includes("teacher"))
      );
      const students = formatUsersForInputSearch(
        users.filter((user) => user.role.includes("student"))
      );
      setTeachers(teachers);
      setStudents(students);
    }
  }, [users]);

  useEffect(() => {
    if (start_date && end_date && user) {
      handleSearch();
    }
  }, [user, lessons]);

  const handleSearch = () => {
    let start_date_formated = null;
    if (start_date) start_date_formated = new Date(start_date).toISOString();
    let end_date_formated = null;
    if (end_date) end_date_formated = new Date(end_date).toISOString();

    dispathFormSearch({
      teacherId: teacher_selected?.id || null,
      studentId: student_selected?.id || null,
      startDate: start_date_formated,
      endDate: end_date_formated,
    });
    setErrorMessageFormSearch("");
  };

  const handleCheckAll = (value) => {
    setLessonsToDelete(
      lessons_to_delete.map((lesson_to_delete) => ({
        ...lesson_to_delete,
        isToDelete: value,
      }))
    );
  };

  const handleCheck = (value, id) => {
    setLessonsToDelete(
      lessons_to_delete.map((lesson_to_delete) =>
        lesson_to_delete.id === id
          ? { ...lesson_to_delete, isToDelete: value }
          : lesson_to_delete
      )
    );
  };

  const handleClickShow = (id) => {
    const lesson = lessons.find((lesson) => lesson.id === id);
    setSelectedLesson(lesson);
    setIsShowFooterDetailLesson(false);
    setPopupDetailLesson(true);
  };

  useEffect(() => {
    if (form_state_form_search.success) {
      fetchLessonsToDelete(form_state_form_search.data);
    }
    if (form_state_form_search.error) {
      setErrorMessageFormSearch(form_state_form_search.message);
    } else {
      setErrorMessageFormSearch("");
    }
  }, [form_state_form_search]);

  return (
    <div className="container mx-auto p-0 sm:p-4">
      <PopupDeleteLesson
        is_open_popup_delete={is_open_popup_delete}
        setIsOpenPopupDelete={setIsOpenPopupDelete}
        lesson_ids={lessons_to_delete
          ?.filter((lesson_to_delete) => lesson_to_delete.isToDelete)
          .map((lesson_to_delete) => lesson_to_delete.id)}
        handleAction={() => {
          handleSearch();
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-[35%_65%] gap-8">
        <form action={handleSearch}>
          <div className="space-y-4 p-5 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="start-date">Profesor</Label>
              <InputSearch
                data={teachers}
                value={teacher_selected}
                setValue={setTeacherSelected}
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="start-date">Estudiante</Label>
              <InputSearch
                data={students}
                value={student_selected}
                setValue={setStudentSelected}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-date">Fecha Inicial</Label>
              <Input
                id="start-date"
                type="date"
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Fecha Final</Label>
              <Input
                id="end-date"
                type="date"
                value={end_date}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <SubmitButtonSearch />

            <ErrorAlert message={error_message_form_search} />
          </div>
        </form>
        <div className="space-y-4 p-1.5 sm:p-5 rounded-lg border bg-card text-card-foreground shadow-sm">
          {lessons_to_delete && lessons_to_delete?.length > 0 ? (
            <>
              <div>
                <h2 className="text-xl font-bold mb-4">
                  Clases a eliminar
                  {"  "}
                  {lessons_to_delete &&
                    `${lessons_to_delete.filter((lesson_to_delete) => lesson_to_delete.isToDelete).length} / ${lessons_to_delete.length}`}
                </h2>
              </div>

              <div className="border relative rounded-md max-h-[65vh] sm:max-h-[50vh] overflow-y-auto">
                <Table className="max-h-[65vh] sm:max-h-[50vh] overflow-y-auto">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-primary font-bold flex justify-start items-center">
                        <Checkbox
                          onCheckedChange={handleCheckAll}
                          defaultChecked={true}
                        />
                      </TableHead>

                      <TableHead className="text-primary font-bold">
                        Students
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Teacher
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Type
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Status
                      </TableHead>
                      <TableHead className="text-primary font-bold">
                        Fecha
                      </TableHead>
                      <TableHead className="text-primary font-bold w-fit"></TableHead>
                      <TableHead className="text-primary text-right font-bold"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lessons_to_delete?.map((lesson_to_delete, index) => (
                      <TableRow key={lesson_to_delete.id}>
                        <TableCell>
                          <Checkbox
                            checked={lesson_to_delete.isToDelete}
                            onCheckedChange={(value) =>
                              handleCheck(value, lesson_to_delete.id)
                            }
                          />
                        </TableCell>

                        <TableCell>
                          {lesson_to_delete.studentLessons.map(
                            (student_lesson) => (
                              <p key={student_lesson.id}>
                                {student_lesson.student.shortName}
                              </p>
                            )
                          )}
                        </TableCell>

                        <TableCell>
                          {lesson_to_delete.teacher.shortName}
                        </TableCell>
                        <TableCell>
                          {lesson_to_delete.isGroup ? "Grupal" : "Individual"}
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div
                                  className="w-6 h-6 rounded-full"
                                  style={{
                                    backgroundColor:
                                      lesson_to_delete?.background,
                                  }}
                                ></div>
                              </TooltipTrigger>

                              <TooltipContent>
                                <p className="p-3 font-bold">
                                  {lesson_to_delete.lesson_status}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>

                        <TableCell>
                          {lesson_to_delete.date}-
                          {format(
                            new Date(lesson_to_delete.startDate).toISOString(),
                            "hh:mm a"
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className=""
                            onClick={() => handleClickShow(lesson_to_delete.id)}
                          >
                            ver
                          </Button>
                        </TableCell>
                        <TableCell className="text-right"></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button
                type="submit"
                className="w-full disabled:pointer-events-auto disabled:cursor-not-allowed"
                onClick={() => setIsOpenPopupDelete(true)}
              >
                Eliminar clases
              </Button>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <PaperSearchIcon size={42} />
              <h1 className="text-xl font-medium">
                No se han encontrado clases.
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
