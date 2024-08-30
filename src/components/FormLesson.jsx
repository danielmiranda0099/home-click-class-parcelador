"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  CreateNewLesson,
  GetLessons,
  RescheduleLesson,
  UpdateLesson,
} from "@/actions/CrudLesson";
import { useLessonStore } from "@/store/lessonStore";
import { useUiStore } from "@/store/uiStores";
import { FormattedLessons } from "@/utils/formattedLessons";
import { formattedDateForInput } from "@/utils/formattedDateForInput";

// STATE:
//   CREATE
//   EDIT
//   RESCHEDULE
export function FormLesson({ rol }) {
  const AddNewLesson = useLessonStore((state) => state.AddNewLesson);
  //TODO FORMSTATE EN UN OBJETO POR FAVOR
  const popupFormLessonState = useUiStore(
    (state) => state.popupFormLessonState
  );
  const is_open = useUiStore((state) => state.popupFormLesson);
  const setIsOpen = useUiStore((state) => state.setPopupFormLesson);
  const selected_lesson = useLessonStore((state) => state.selected_lesson);
  const SetLessons = useLessonStore((state) => state.SetLessons);

  console.log("formato fecha", selected_lesson?.start);

  const OnSubmit = async (form_data) => {
    if (popupFormLessonState === "CREATE") {
      const new_lesson = await CreateNewLesson(form_data);
      AddNewLesson(new_lesson, "admin");
    }
    if (popupFormLessonState === "EDIT") {
      await UpdateLesson(selected_lesson.id, form_data);

      const data = await GetLessons();
      const lessons = FormattedLessons(data, rol);

      SetLessons(lessons);
      const formDataObject = Object.fromEntries(form_data.entries());
      console.log(formDataObject);
    }
    if (popupFormLessonState === "RESCHEDULE") {
      const new_date = {
        id: selected_lesson?.id,
        start_date: form_data.get("start-date"),
        end_date: form_data.get("end-date"),
      };
      console.log("RESCHEDULE", new_date);
      await RescheduleLesson(new_date);

      const data = await GetLessons();
      const lessons = FormattedLessons(data, rol);

      SetLessons(lessons);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {popupFormLessonState === "CREATE"
              ? "Create New Class"
              : popupFormLessonState === "EDIT"
                ? "Edit Class"
                : popupFormLessonState === "RESCHEDULE"
                  ? "Reschedule Class"
                  : "UNKNOWN"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <form action={OnSubmit} className="grid gap-4">
            {popupFormLessonState !== "RESCHEDULE" && (
              <>
                <div
                  className={`grid gap-2 ${
                    popupFormLessonState === "RESCHEDULE"
                      ? "pointer-events-none opacity-30"
                      : ""
                  }`}
                >
                  <Label htmlFor="topic">Class Topic</Label>
                  <Textarea
                    id="topic"
                    name="topic"
                    placeholder="Enter class topic"
                    defaultValue={
                      popupFormLessonState !== "CREATE"
                        ? selected_lesson.topic
                        : ""
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url_teams">Teams Link</Label>
                  <Input
                    name="url_teams"
                    id="url_teams"
                    type="url"
                    placeholder="Enter Teams link"
                    defaultValue={
                      popupFormLessonState !== "CREATE"
                        ? selected_lesson?.url_teams
                        : ""
                    }
                  />
                </div>
              </>
            )}

            {popupFormLessonState !== "EDIT" && (
              <div
                className={`grid grid-cols-2 gap-4
                }`}
              >
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="datetime-local"
                    defaultValue={
                      popupFormLessonState !== "CREATE"
                        ? formattedDateForInput(selected_lesson?.start)
                        : ""
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="datetime-local"
                    defaultValue={
                      popupFormLessonState !== "CREATE"
                        ? formattedDateForInput(selected_lesson?.end)
                        : ""
                    }
                    required
                  />
                </div>
              </div>
            )}
            {popupFormLessonState !== "RESCHEDULE" && (
              <div className="grid gap-2">
                <Label htmlFor="participants">Participants</Label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    name="is_group"
                    id="group-class"
                    checked={selected_lesson?.is_group}
                  />
                  <Label htmlFor="group-class">Group Class</Label>
                </div>
                <Select id="participants">
                  <SelectTrigger>
                    <SelectValue placeholder="Select participants" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="participant1">Participant 1</SelectItem>
                    <SelectItem value="participant2">Participant 2</SelectItem>
                    <SelectItem value="participant3">Participant 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {rol === "teacher" && (
              <div className={`grid gap-2`}>
                <Label htmlFor="teacher_observations">Observation Class</Label>
                <Textarea
                  id="teacher_observations"
                  name="teacher_observations"
                  placeholder="Enter Observation Class"
                  defaultValue={
                    popupFormLessonState !== "CREATE"
                      ? selected_lesson?.teacher_observations
                      : ""
                  }
                />
              </div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button type="submit">
                {popupFormLessonState === "CREATE"
                  ? "Create"
                  : popupFormLessonState === "EDIT"
                    ? "Edit"
                    : popupFormLessonState === "RESCHEDULE"
                      ? "Reschedule"
                      : "UNKNOWN"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
