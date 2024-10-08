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
  GetLessons,
  PayLesson,
  RegisterLesson,
} from "@/actions/CrudLesson";
import { FormattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";
import {
  BookIcon,
  CircleCheckIcon,
  FeedbackIcon,
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
            <DialogFooter className="flex justify-start 	items-start">
              <div className="flex gap-2">
                {/* TODO: Refact todo este mierdero */}
                {rol === "student" && !lesson?.isConfirmed && (
                  <Button
                    onClick={async () => {
                      setPopupDetailLesson(false);
                      setPopupFormConfirmClass(true);
                    }}
                  >
                    Confirm Class
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {rol === "teacher" && !lesson?.isRegistered && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPopupDetailLesson(false);
                      setPopupFormLessonReport(true);
                    }}
                  >
                    Editar Informe
                  </Button>
                )}
                {rol !== "student" && (
                  <>
                    {lesson?.isRegistered && rol === "admin" && (
                      <Button
                        onClick={() => {
                          setPopupDetailLesson(false);
                          setPopupFormLessonState("EDIT");
                          setPopupFormLesson(true);
                        }}
                      >
                        Edit
                      </Button>
                    )}

                    {!lesson?.isConfirmed && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPopupDetailLesson(false);
                          setPopupFormReschedule(true);
                        }}
                      >
                        Reschedule
                      </Button>
                    )}
                  </>
                )}
                {rol === "admin" &&
                  lesson?.isRegistered &&
                  !lesson?.isTeacherPaid && (
                    <Button
                      onClick={async () => {
                        await PayLesson([lesson?.id], { isTeacherPaid: true });
                        //TODO: De nuevo esto se podria mejorra solo actualizando el estado
                        const data = await GetLessons();
                        const lessons = FormattedLessonsForCalendar(data, rol);

                        SetLessons(lessons);
                        setPopupDetailLesson(false);
                      }}
                    >
                      Hacer Pago
                    </Button>
                  )}
                <Button
                  variant="outline"
                  onClick={() => setPopupDetailLesson(false)}
                >
                  Exit
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
