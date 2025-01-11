"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { useUiStore } from "@/store/uiStores";
import { useLessonsStore } from "@/store/lessonStore";

import {
  CircleCheckIcon,
  RescheduleIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons";
import { formatCurrency } from "@/utils/formatCurrency";
import moment from "moment";
import { FormLesson } from "@/components/formLesson";
import { DetailReviewLesson } from "./DetailReviewLesson";
import { FooterDetailLesson } from "./FooterDetailLesson";
import { ReasonsRescheduled } from "./ReasonsRescheduled";
import { Badge } from "@/components/ui/badge";

const formattedDate = (start_date, end_date) => {
  const startDate = moment(start_date, "YYYY-MM-DD HH:mm");
  const endDate = moment(end_date, "YYYY-MM-DD HH:mm");

  const datePart = startDate.format("MMMM D");

  const startTime = startDate.format("h:mmA").toLowerCase();
  const endTime = endDate.format("h:mmA").toLowerCase();

  return `${datePart}, de ${startTime} a ${endTime}`;
};

//TODO: Refact Component
export function PopupDetailLesson({ user, rol, showFooter = true }) {
  const { setIsShowFooterDetailLesson } = useUiStore();
  const { selected_lesson: lesson } = useLessonsStore();
  const { popupDetailLesson: is_open, setPopupDetailLesson } = useUiStore();

  return (
    <>
      {/* TODO: QUITAR Y COLOCAR <RORMLESSON /> EN UN AMAYOR HERARQUIA */}
      {rol !== "student" && <FormLesson rol={rol} />}
      {lesson && (
        <Dialog
          open={is_open}
          onOpenChange={(open) => {
            if (!open) {
              setIsShowFooterDetailLesson(true);
            }
            setPopupDetailLesson(open);
          }}
        >
          <DialogContent className="sm:max-w-[800px] overflow-y-scroll max-h-[95vh]">
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
                    <p className="text-muted-foreground">
                      {lesson && lesson?.lesson_status}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="flex flex-col items-end w-[fit-content] pl-2.5">
                    {lesson?.studentLessons &&
                      lesson?.studentLessons.map(
                        (student_lesson) =>
                          (rol === "admin" ||
                            student_lesson.studentId == user.id) && (
                            <h2 className="font-medium" key={student_lesson.id}>
                              {formatCurrency(
                                student_lesson.studentFee.toString()
                              )}
                            </h2>
                          )
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
                              lesson?.studentLessons.reduce(
                                (total, lesson) => lesson.studentFee + total,
                                0
                              ) - lesson?.teacherPayment
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
                    {lesson &&
                      lesson?.studentLessons.map((student_lesson) => (
                        <div
                          className="flex gap-2 pb-1"
                          key={student_lesson.id}
                        >
                          <p
                            className="text-muted-foreground"
                            key={student_lesson?.student.email}
                          >
                            {student_lesson?.student.shortName}
                          </p>
                          {(student_lesson.studentId == user.id ||
                            rol === "admin") &&
                            (student_lesson.isStudentPaid ? (
                              <Badge variant="outlineSucess">Pagado</Badge>
                            ) : (
                              <Badge variant="outlineError">Debe</Badge>
                            ))}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <UserIcon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Profesor</p>
                    <div className="flex gap-2">
                      <p className="text-muted-foreground">
                        {lesson && lesson?.teacher.shortName}
                      </p>
                      {lesson &&
                        rol !== "student" &&
                        (lesson.isTeacherPaid ? (
                          <Badge variant="outlineSucess">Pagado</Badge>
                        ) : (
                          <Badge variant="outlineError">Por pagar</Badge>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <DetailReviewLesson lesson={lesson} rol={rol} />

              {rol === "admin" && lesson?.isRescheduled && (
                <>
                  <Separator />
                  <div className="flex items-start gap-4">
                    <RescheduleIcon className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">Reagendada</p>
                      <ReasonsRescheduled reason={lesson.reasonsRescheduled} />
                    </div>
                  </div>
                </>
              )}
            </div>

            <FooterDetailLesson rol={rol} showFooter={showFooter} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
