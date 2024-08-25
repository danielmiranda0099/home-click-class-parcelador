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
import { CancelLesson, GetLessons } from "@/actions/CrudLesson";
import { FormattedLessons } from "@/utils/formattedLessons";

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

export function PopupDetailLesson() {
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

  console.log("lesson en modal", lesson);
  return (
    <Dialog open={is_open} onOpenChange={setPopupDetailLesson}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Class Details</DialogTitle>
          <div>
            {/* <p className="text-sm text-muted-foreground">Start: June 1, 2023 - End: June 30, 2023</p> */}
            <p className="text-sm text-muted-foreground">
              Start: {formattedDate(lesson.start)}
            </p>
            <p className="text-sm text-muted-foreground">
              End: {formattedDate(lesson.end)}
            </p>
          </div>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="flex items-start gap-4">
            <CircleCheckIcon className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">Class Status</p>
              <p className="text-muted-foreground">
                {lesson &&
                  (lesson?.is_canceled
                    ? "Canceled"
                    : lesson?.is_scheduled &&
                      lesson?.is_approved &&
                      lesson?.is_paid
                    ? "Approved and Paid"
                    : lesson?.is_scheduled && lesson?.is_approved
                    ? "Approved"
                    : lesson?.is_scheduled
                    ? "Scheduled"
                    : "Unknown Status")}
              </p>
            </div>
          </div>
          {/* <div className="flex items-start gap-4">
            <CreditCardIcon className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">Payment Status</p>
              <p className="text-muted-foreground">Paid</p>
            </div>
          </div> */}
          <Separator />
          {/* <div className="flex items-start gap-4">
            <UserIcon className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">Teacher</p>
              <p className="text-muted-foreground">John Doe</p>
            </div>
          </div> */}
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
          {/* <div className="flex items-start gap-4">
            <StickyNoteIcon className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">Observations/Issues</p>
              <p className="text-muted-foreground">No major issues reported.</p>
            </div>
          </div> */}
        </div>
        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
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
            <Button variant="outline">Reschedule</Button>
            <Button
              variant="outline"
              onClick={async () => {
                await CancelLesson(lesson.id);
                const data = await GetLessons();
                const lessons = FormattedLessons(data);

                SetLessons(lessons);
                setPopupDetailLesson(false)
              }}
            >
              Cancel Class
            </Button>
          </div>
          <div>
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
  );
}
function BookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function CircleCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CreditCardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function StickyNoteIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
      <path d="M15 3v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
