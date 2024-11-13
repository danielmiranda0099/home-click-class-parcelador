"use client";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CancelLesson, DeleteLesson } from "@/actions/CrudLesson";
import { useLessonsStore } from "@/store/lessonStore";
import { useUiStore } from "@/store/uiStores";
import { useUserSession } from "@/hooks";
import {
  CalendarIcon,
  CheckIcon,
  DollarIcon,
  PencilIcon,
} from "@/components/icons";
export function FooterDetailLesson({ rol }) {
  const { selected_lesson: lesson, setLessons } = useLessonsStore();
  const user_session = useUserSession();
  const {
    setPopupFormLesson,
    setPopupDetailLesson,
    setPopupFormLessonState,
    setPopupFormConfirmClass,
    setPopupFormReschedule,
    setPopupFormLessonReport,
  } = useUiStore();
  return (
    <DialogFooter className="sm:justify-between">
      <div className="flex gap-2">
        {!lesson?.isConfirmed && !lesson?.isRegistered && rol === "admin" && (
          <>
            {!lesson?.isCanceled && (
              <Button
                variant="outline"
                className="border-red-400 text-red-500 hover:bg-red-100 hover:text-red-500"
                onClick={async () => {
                  CancelLesson(lesson?.id, true);
                  setLessons(rol);
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
                  setLessons(rol);
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
                setLessons(rol);
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
          {rol === "student" &&
            !lesson?.studentLessons.find(
              (student_lesson) =>
                student_lesson.studentId === parseInt(user_session.user.id, 10)
            ).isConfirmed && (
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
          {rol === "admin" && !lesson?.isStudentPaid && !lesson.isGroup && (
            <Button
              className="flex gap-2"
              onClick={async () => {
                // await PayLesson([lesson?.id], {
                //   isStudentPaid: true,
                // });
                //TODO: De nuevo esto se podria mejorra solo actualizando el estado
                setLessons(rol);
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
                  // await PayLesson([lesson?.id], {
                  //   isTeacherPaid: true,
                  // });
                  //TODO: De nuevo esto se podria mejorra solo actualizando el estado
                  setLessons(rol);
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
          <Button variant="outline" onClick={() => setPopupDetailLesson(false)}>
            Exit
          </Button>
        </div>
      </div>
    </DialogFooter>
  );
}
