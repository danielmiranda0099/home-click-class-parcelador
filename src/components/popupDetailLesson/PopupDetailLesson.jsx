"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUiStore } from "@/store/uiStores";
import { useLessonStore } from "@/store/lessonStore";
import { useToast } from "@/components/ui/use-toast";
import {
  CancelLesson,
  DeleteLesson,
  GetLessons,
  PayLesson,
  RegisterLesson,
} from "@/actions/CrudLesson";
import { FormattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";
import {
  BookIcon,
  CalendarIcon,
  CheckIcon,
  CircleCheckIcon,
  DollarIcon,
  FeedbackIcon,
  PencilIcon,
  RatingIcon,
  RescheduleIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons";
import { formatCurrency } from "@/utils/formatCurrency";
import moment from "moment";
import { FormLesson } from "@/components/formLesson";
import { DetailReviewLesson } from "./DetailReviewLesson";

const formattedDate = (start_date, end_date) => {
  const startDate = moment(start_date, "YYYY-MM-DD HH:mm");
  const endDate = moment(end_date, "YYYY-MM-DD HH:mm");

  // Formatear la fecha como "September 3"
  const datePart = startDate.format("MMMM D");

  // Formatear las horas como "4:00p.m" y "5:00p.m"
  const startTime = startDate.format("h:mmA").toLowerCase();
  const endTime = endDate.format("h:mmA").toLowerCase();

  // Combinar todo en el formato deseado
  return `${datePart}, de ${startTime} a ${endTime}`;
};

//TODO: Refact Component
export function PopupDetailLesson({ rol }) {
  const { selected_lesson: lesson, SetLessons } = useLessonStore();
  const {
    setPopupFormLesson,
    popupDetailLesson: is_open,
    setPopupDetailLesson,
    setPopupFormLessonState,
    setPopupFormConfirmClass,
    setPopupFormReschedule,
    setPopupFormLessonReport,
  } = useUiStore();
  const { toast } = useToast();

  console.log("lesson en modal", lesson);
  return (
    <>
      {/* TODO: QUITAR Y COLOCAR <RORMLESSON /> EN UN AMAYOR HERARQUIA */}
      {rol !== "student" && <FormLesson rol={rol} />}
      {lesson && (
        <Dialog open={is_open} onOpenChange={setPopupDetailLesson}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogDescription></DialogDescription>
            <DialogHeader>
              <DialogTitle>Class Details</DialogTitle>
              <div className={`grid grid-cols-2 gap-4`}>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {formattedDate(lesson.start, lesson.end)}
                  </p>
                </div>
              </div>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid grid-cols-2">
                <div className="flex items-start gap-4">
                  <div>
                    <CircleCheckIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Class Status</p>
                    {/*TODO: hacer funcion para esto */}
                    <p className="text-muted-foreground">
                      {/*TODO: corregir _ */}
                      {lesson && lesson?.lesson_status}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="flex flex-col items-end w-[fit-content] pl-2.5">
                    {rol !== "teacher" && lesson?.studentFee && (
                      <h2 className="font-medium">
                        {formatCurrency(lesson?.studentFee.toString())}
                      </h2>
                    )}
                    {rol !== "student" && lesson?.teacherPayment && (
                      <h2 className="font-medium">
                        {rol === "admin" && "-"}{" "}
                        {formatCurrency(lesson?.teacherPayment.toString())}
                      </h2>
                    )}

                    {rol === "admin" && lesson?.teacherPayment && (
                      <>
                        <Separator />
                        <h2 className="font-medium">
                          {formatCurrency(
                            (
                              lesson?.studentFee - lesson?.teacherPayment
                            ).toString()
                          )}
                        </h2>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Separator />

              <div className="grid grid-cols-2">
                <div className="flex items-start gap-4">
                  <UsersIcon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Estudiantes</p>
                    <p className="text-muted-foreground">
                      {lesson?.student.firstName +
                        " " +
                        lesson?.student.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <UserIcon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Profesor</p>
                    {/*TODO: hacer funcion para esto */}
                    <p className="text-muted-foreground">
                      {lesson &&
                        lesson?.teacher.firstName +
                          " " +
                          lesson?.teacher.lastName}
                    </p>
                  </div>
                </div>
              </div>

              <DetailReviewLesson lesson={lesson} rol={rol} />

              {rol === "admin" && lesson?.isRescheduled && (
                <div className="flex items-start gap-4">
                  <RescheduleIcon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Reagendada</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="sm:justify-between">
              <div className="flex gap-2">
                {!lesson?.isConfirmed &&
                  !lesson?.isRegistered &&
                  rol === "admin" && (
                    <>
                      {!lesson?.isCanceled && (
                        <Button
                          variant="outline"
                          className="border-red-400 text-red-500 hover:bg-red-100 hover:text-red-500"
                          onClick={async () => {
                            CancelLesson(lesson?.id, true);
                            const data = await GetLessons();
                            const lessons = FormattedLessonsForCalendar(
                              data,
                              rol
                            );

                            SetLessons(lessons);
                            setPopupDetailLesson(false);
                          }}
                        >
                          Cancelar
                        </Button>
                      )}

                      {lesson?.isCanceled && (
                        <Button
                          variant="outline"
                          className="border-red-400 text-red-500 hover:bg-red-100 hover:text-red-500"
                          onClick={async () => {
                            CancelLesson(lesson?.id, false);
                            const data = await GetLessons();
                            const lessons = FormattedLessonsForCalendar(
                              data,
                              rol
                            );

                            SetLessons(lessons);
                            setPopupDetailLesson(false);
                          }}
                        >
                          Reactivar
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="border-red-400 text-red-500 hover:bg-red-100 hover:text-red-500"
                        onClick={async () => {
                          DeleteLesson([lesson.id]);
                          const data = await GetLessons();
                          const lessons = FormattedLessonsForCalendar(
                            data,
                            rol
                          );

                          SetLessons(lessons);
                          setPopupDetailLesson(false);
                        }}
                      >
                        Eliminar
                      </Button>
                    </>
                  )}
              </div>
              <div className="flex gap-2">
                <div className="flex gap-2">
                  {/* TODO: Refact todo este mierdero */}
                  {rol === "student" && !lesson?.isConfirmed && (
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
                  {rol === "admin" && !lesson?.isStudentPaid && (
                    <Button
                      className="flex gap-2"
                      onClick={async () => {
                        await PayLesson([lesson?.id], {
                          isStudentPaid: true,
                        });
                        //TODO: De nuevo esto se podria mejorra solo actualizando el estado
                        const data = await GetLessons();
                        const lessons = FormattedLessonsForCalendar(data, rol);

                        SetLessons(lessons);
                        setPopupDetailLesson(false);
                      }}
                    >
                      <DollarIcon size={18} />
                      Pago Estudiante
                    </Button>
                  )}
                  {rol === "admin" &&
                    lesson?.isRegistered &&
                    !lesson?.isTeacherPaid && (
                      <Button
                        className="flex gap-2"
                        onClick={async () => {
                          await PayLesson([lesson?.id], {
                            isTeacherPaid: true,
                          });
                          //TODO: De nuevo esto se podria mejorra solo actualizando el estado
                          const data = await GetLessons();
                          const lessons = FormattedLessonsForCalendar(
                            data,
                            rol
                          );

                          SetLessons(lessons);
                          setPopupDetailLesson(false);
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
                            setPopupFormLessonState("EDIT");
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
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
