"use client";
import { useState } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CancelLesson, DeleteLesson } from "@/actions/CrudLesson";
import { useLessonsStore } from "@/store/lessonStore";
import { useUiStore } from "@/store/uiStores";
import { useCustomToast, useUserSession } from "@/hooks";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDown,
  DollarIcon,
  EllipsisVerticalIcon,
  PencilIcon,
} from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  payStudentLessonsAndRegisterTransactions,
  payTeacherLessonAndRegisterTransaction,
} from "@/actions/lessonTransactions";

export function FooterDetailLesson({ rol, showFooter }) {
  const [status_button, setStatusButton] = useState({
    paidStudent: false,
    paidTeacher: false,
  });
  const { selected_lesson: lesson, setLessons } = useLessonsStore();
  const user_session = useUserSession();
  const {
    setPopupFormLesson,
    setPopupDetailLesson,
    setPopupFormConfirmClass,
    setPopupFormReschedule,
    setPopupFormLessonReport,
  } = useUiStore();
  const { toastSuccess, toastError } = useCustomToast();

  return (
    <DialogFooter className="sm:justify-between">
      {showFooter && (
        <>
          <div className="flex gap-2">
            {!lesson?.isConfirmed &&
              !lesson?.isRegistered &&
              rol === "admin" && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      {!lesson?.isCanceled && (
                        <Button
                          variant="outline"
                          className="border-red-400 text-red-500 hover:bg-red-100 hover:text-red-500"
                          onClick={async () => {
                            await CancelLesson(lesson?.id, true);
                            setLessons(rol);
                            setPopupDetailLesson(false);
                          }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </DropdownMenuItem>
                    {lesson?.isCanceled && (
                      <DropdownMenuItem>
                        <Button
                          variant="outline"
                          className="border-red-400 text-red-500 hover:bg-red-100 hover:text-red-500"
                          onClick={async () => {
                            await CancelLesson(lesson?.id, false);
                            setLessons(rol);
                            setPopupDetailLesson(false);
                          }}
                        >
                          Reactivar
                        </Button>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Button
                        variant="outline"
                        className="border-red-400 text-red-500 hover:bg-red-100 hover:text-red-500"
                        onClick={async () => {
                          await DeleteLesson([lesson.id]);
                          setLessons(rol);
                          setPopupDetailLesson(false);
                        }}
                      >
                        Eliminar
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
          </div>
          <div className="flex gap-2">
            <div className="flex gap-2">
              {rol === "student" &&
                !lesson?.studentLessons.find(
                  (student_lesson) =>
                    student_lesson.studentId ===
                    parseInt(user_session?.user.id, 10)
                )?.isConfirmed && (
                  <Button
                    className="flex gap-2"
                    onClick={async () => {
                      setPopupDetailLesson(false);
                      setPopupFormConfirmClass(true);
                    }}
                  >
                    <CheckIcon size={18} />
                    Confirm Class
                  </Button>
                )}
            </div>

            <div className="flex gap-2">
              {rol === "admin" &&
                !lesson?.studentLessons[0].isStudentPaid &&
                !lesson.isGroup && (
                  <Button
                    className="flex gap-2"
                    disabled={status_button.paidStudent}
                    onClick={async () => {
                      setStatusButton({ ...status_button, paidStudent: true });
                      const data =
                        await payStudentLessonsAndRegisterTransactions([
                          lesson?.studentLessons[0].id,
                        ]);
                      setStatusButton({ ...status_button, paidStudent: false });
                      if (data.success) {
                        toastSuccess({ title: "Pago Confirmado." });
                        setLessons(rol);
                        setPopupDetailLesson(false);
                      } else {
                        toastError({ title: "Al parecer hubo un error." });
                      }
                    }}
                  >
                    <DollarIcon size={18} />
                    Pago Estudiante
                  </Button>
                )}
              {rol === "admin" &&
                lesson.isGroup &&
                lesson?.studentLessons?.some(
                  (student_lesson) => student_lesson.isStudentPaid === false
                ) && (
                  <div className="flex flex-col items-center gap-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="flex gap-2"
                          disabled={status_button.paidStudent}
                        >
                          <ChevronDown size={18} />
                          Pago Estudiante
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {lesson?.studentLessons.map(
                          (student_lesson) =>
                            !student_lesson.isStudentPaid && (
                              <DropdownMenuItem
                                key={student_lesson.id}
                                onClick={async () => {
                                  setStatusButton({
                                    ...status_button,
                                    paidStudent: true,
                                  });
                                  const data =
                                    await payStudentLessonsAndRegisterTransactions(
                                      [student_lesson.id]
                                    );
                                  setStatusButton({
                                    ...status_button,
                                    paidStudent: false,
                                  });
                                  if (data.success) {
                                    toastSuccess({ title: "Pago Confirmado." });
                                    setLessons(rol);
                                    setPopupDetailLesson(false);
                                  } else {
                                    toastError({
                                      title: "Al parecer hubo un error.",
                                    });
                                  }
                                }}
                              >
                                {student_lesson.student.shortName}
                              </DropdownMenuItem>
                            )
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {rol === "admin" &&
                lesson?.isRegistered &&
                !lesson?.isTeacherPaid && (
                  <Button
                    className="flex gap-2"
                    onClick={async () => {
                      setStatusButton({
                        ...status_button,
                        paidTeacher: true,
                      });
                      const data = await payTeacherLessonAndRegisterTransaction(
                        [lesson?.id]
                      );
                      setStatusButton({
                        ...status_button,
                        paidTeacher: false,
                      });
                      if (data.success) {
                        toastSuccess({ title: "Pago Confirmado." });
                        setLessons(rol);
                        setPopupDetailLesson(false);
                      } else {
                        toastError({
                          title: "Al parecer hubo un error.",
                        });
                      }
                    }}
                  >
                    <DollarIcon size={18} />
                    Pago Profesor
                  </Button>
                )}
              {rol === "teacher" && !lesson?.isRegistered && (
                <Button
                  className="flex gap-2"
                  onClick={() => {
                    setPopupDetailLesson(false);
                    setPopupFormLessonReport(true);
                  }}
                >
                  <PencilIcon size={18} />
                  Editar Informe
                </Button>
              )}
              {rol !== "student" && (
                <>
                  {!lesson?.isConfirmed && (
                    <Button
                      className="flex gap-2"
                      onClick={() => {
                        setPopupDetailLesson(false);
                        setPopupFormReschedule(true);
                      }}
                    >
                      <CalendarIcon size={18} />
                      Reschedule
                    </Button>
                  )}

                  {!lesson?.isRegistered && rol === "admin" && (
                    <Button
                      className="flex gap-2"
                      onClick={() => {
                        setPopupDetailLesson(false);
                        setPopupFormLesson(true);
                      }}
                    >
                      <PencilIcon size={18} />
                      Edit
                    </Button>
                  )}
                </>
              )}
              <Button
                variant="outline"
                onClick={() => setPopupDetailLesson(false)}
              >
                Exit
              </Button>
            </div>
          </div>
        </>
      )}

      {!showFooter && (
        <div className="flex w-full justify-end">
          <Button variant="outline" onClick={() => setPopupDetailLesson(false)}>
            Exit
          </Button>
        </div>
      )}
    </DialogFooter>
  );
}
