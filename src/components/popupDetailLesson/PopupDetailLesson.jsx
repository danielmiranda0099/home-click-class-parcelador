"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUiStore } from "@/store/uiStores";
import { useLessonStore } from "@/store/lessonStore";
import { useToast } from "@/components/ui/use-toast";
import {
  CancelLesson,
  GetLessons,
  PayTeacher,
  RegisterLesson,
} from "@/actions/CrudLesson";
import { FormattedLessons } from "@/utils/formattedLessons";
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

export function PopupDetailLesson({ rol }) {
  const lesson = useLessonStore((state) => state.selected_lesson);
  const setPoppupFormLesson = useUiStore((state) => state.setPopupFormLesson);
  const is_open = useUiStore((state) => state.popupDetailLesson);
  const setPopupDetailLesson = useUiStore(
    (state) => state.setPopupDetailLesson
  );
  const setPopupFormLessonState = useUiStore(
    (state) => state.setPopupFormLessonState
  );
  const SetLessons = useLessonStore((state) => state.SetLessons);
  const setPopupFormConfirmClass = useUiStore(
    (state) => state.setPopupFormConfirmClass
  );
  const { toast } = useToast();

  console.log("lesson en modal", lesson);
  return (
    <>
      {/* TODO: QUITAR Y COLOCAR <RORMLESSON /> EN UN AMAYOR HERARQUIA */}
      {rol !== "student" && <FormLesson rol={rol} />}
      <Dialog open={is_open} onOpenChange={setPopupDetailLesson}>
        <DialogContent className="sm:max-w-[700px]">
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
                    {lesson && lesson?.lesson_status}
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex flex-col items-end w-[fit-content] pl-2.5">
                  {rol !== "teacher" && lesson?.student_fee && (
                    <h2 className="font-medium">
                      {formatCurrency(lesson?.student_fee.toString())}
                    </h2>
                  )}
                  {rol !== "student" && lesson?.teacher_payment && (
                    <h2 className="font-medium">
                      {rol === "admin" && "-"}{" "}
                      {formatCurrency(lesson?.teacher_payment.toString())}
                    </h2>
                  )}

                  {rol === "admin" && lesson?.teacher_payment && (
                    <>
                      <Separator />
                      <h2 className="font-medium">
                        {formatCurrency(
                          (
                            lesson?.student_fee - lesson?.teacher_payment
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
                <UserIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Profesor</p>
                  {/*TODO: hacer funcion para esto */}
                  <p className="text-muted-foreground">
                    {lesson && lesson?.teacher}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <UsersIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Estudiantes</p>
                  <p className="text-muted-foreground">{lesson?.students}</p>
                </div>
              </div>
            </div>

            <DetailReviewLesson lesson={lesson} rol={rol} />

            {rol === "admin" && lesson?.is_rescheduled && (
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
              {rol === "student" && !lesson?.is_confirmed && (
                <Button
                  onClick={async () => {
                    setPopupDetailLesson(false);
                    setPopupFormConfirmClass(true);
                  }}
                >
                  Confirm Class
                </Button>
              )}
              {rol === "teacher" &&
                lesson?.is_confirmed &&
                !lesson?.is_registered &&
                !lesson?.is_canceled && (
                  <Button
                    onClick={async () => {
                      if (!lesson?.teacher_observations) {
                        toast({
                          variant: "destructive",
                          title: "Por Favor Rellene El Campo De Observación",
                        });
                        console.log("Toast");
                        setPopupDetailLesson(false);
                        return;
                      }
                      await RegisterLesson(lesson.id);

                      const data = await GetLessons();
                      const lessons = FormattedLessons(data, rol);

                      SetLessons(lessons);

                      setPopupDetailLesson(false);
                    }}
                  >
                    Register Class
                  </Button>
                )}
            </div>
            <div className="flex gap-2">
              {rol !== "student" && (
                <>
                  {!lesson?.is_registered && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPopupDetailLesson(false);
                        setPopupFormLessonState("EDIT");
                        setPoppupFormLesson(true);
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  {lesson?.is_registered && rol === "admin" && (
                    <Button
                      onClick={() => {
                        setPopupDetailLesson(false);
                        setPopupFormLessonState("EDIT");
                        setPoppupFormLesson(true);
                      }}
                    >
                      Edit
                    </Button>
                  )}

                  {!lesson?.is_confirmed && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPopupDetailLesson(false);
                        setPopupFormLessonState("RESCHEDULE");
                        setPoppupFormLesson(true);
                      }}
                    >
                      Reschedule
                    </Button>
                  )}
                </>
              )}
              {rol === "admin" &&
                lesson?.is_registered &&
                !lesson?.is_teacher_paid && (
                  <Button
                    onClick={async () => {
                      await PayTeacher(lesson?.id);
                      const data = await GetLessons();
                      const lessons = FormattedLessons(data, rol);

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
    </>
  );
}
