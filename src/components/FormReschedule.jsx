"use client";
import { useUiStore } from "@/store/uiStores";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useLessonStore } from "@/store/lessonStore";
import { GetLessons, RescheduleLesson } from "@/actions/CrudLesson";
import { FormattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { formattedDateForInput } from "@/utils/formattedDateForInput";
import { CheckIcon } from "./icons";

export function FormReschedule({ rol }) {
  const { popupFormReschedule: is_open, setPopupFormReschedule: setIsOpen } =
    useUiStore();

  const { SetLessons, selected_lesson } = useLessonStore();

  const OnSubmit = async (form_data) => {
    console.log("Reschedule");
    const new_date = {
      id: selected_lesson?.id,
      startDate: new Date(form_data.get("start_date")),
    };
    console.log("RESCHEDULE", new_date);
    await RescheduleLesson(new_date);

    const data = await GetLessons();
    const lessons = FormattedLessonsForCalendar(data, rol);

    SetLessons(lessons);

    setIsOpen(false);
  };

  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px] pt-0">
        <DialogDescription></DialogDescription>
        <DialogHeader className="p-0">
          <DialogTitle>Reschedule Class</DialogTitle>
        </DialogHeader>
        <div>
          <form action={OnSubmit} className="grid gap-4">
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
                    selected_lesson?.start
                      ? formattedDateForInput(selected_lesson?.start)
                      : ""
                  }
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" className="flex gap-2">
                <CheckIcon size={18} />
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
