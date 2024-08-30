"use cliente";
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
import { FormLesson } from ".";
import {
  BookIcon,
  CircleCheckIcon,
  FeedbackIcon,
  RatingIcon,
  RescheduleIcon,
  UserIcon,
  UsersIcon,
} from "./icons";
import { formatCurrency } from "@/utils/formatCurrency";

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

const formattedDate = (date) => {
  return new Intl.DateTimeFormat("es-ES", options).format(date);
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
      {rol !== "student" && <FormLesson rol={rol} />}
      <Dialog open={is_open} onOpenChange={setPopupDetailLesson}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Class Details</DialogTitle>
            <div className={`grid grid-cols-2 gap-4`}>
              <div>
                {/* <p className="text-sm text-muted-foreground">Start: June 1, 2023 - End: June 30, 2023</p> */}
                <p className="text-sm text-muted-foreground">
                  Start: {formattedDate(lesson.start)}
                </p>
                <p className="text-sm text-muted-foreground">
                  End: {formattedDate(lesson.end)}
                </p>
              </div>
              {rol !== "student" && lesson?.price_lesson && (
                <h2 className="text-2xl font-medium">
                  {formatCurrency(lesson?.price_lesson.toString())}
                </h2>
              )}
            </div>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="flex items-start gap-4">
              <CircleCheckIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Class Status</p>
                {/*TODO: hacer funcion para esto */}
                <p className="text-muted-foreground">
                  {lesson && lesson?.lesson_status}
                </p>
              </div>
            </div>
            <Separator />
            {rol !== "teacher" && (
              <>
                <div className="flex items-start gap-4">
                  <UserIcon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Teacher</p>
                    {/*TODO: hacer funcion para esto */}
                    <p className="text-muted-foreground">
                      {lesson && lesson?.teacher}
                    </p>
                  </div>
                </div>
                <Separator />
              </>
            )}
            <div className="flex items-start gap-4">
              <UsersIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Participants</p>
                <p className="text-muted-foreground">
                  John Doe, Jane Smith, Bob Johnson
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-4">
              <BookIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Topic</p>
                <p className="text-muted-foreground">{lesson?.topic}</p>
              </div>
            </div>
            {rol === "admin" && lesson?.is_confirmed && (
              <>
                <Separator />
                <div className="flex items-start gap-4">
                  <RatingIcon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Rating Class</p>
                    <p className="text-muted-foreground">
                      {lesson?.lesson_score}
                    </p>
                  </div>
                </div>
              </>
            )}
            {rol === "admin" && lesson?.is_rescheduled && (
              <>
                <Separator />
                <div className="flex items-start gap-4">
                  <RescheduleIcon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Reagendada</p>
                  </div>
                </div>
              </>
            )}
            {rol !== "student" && lesson?.teacher_observations && (
              <>
                <Separator />
                <div className="flex items-start gap-4">
                  <FeedbackIcon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Teacher Observations</p>
                    <p className="text-muted-foreground">
                      {lesson?.teacher_observations}
                    </p>
                  </div>
                </div>
              </>
            )}
            {rol === "admin" &&
              lesson?.is_confirmed &&
              lesson?.student_observations && (
                <>
                  <Separator />
                  <div className="flex items-start gap-4">
                    <FeedbackIcon className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">Student Observations</p>
                      <p className="text-muted-foreground">
                        {lesson?.student_observations}
                      </p>
                    </div>
                  </div>
                </>
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
