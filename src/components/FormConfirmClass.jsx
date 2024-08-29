"use client";
import { useUiStore } from "@/store/uiStores";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { ConfirmLesson, GetLessons } from "@/actions/CrudLesson";
import { useLessonStore } from "@/store/lessonStore";
import { FormattedLessons } from "@/utils/formattedLessons";

export function FormConfirmClass() {
  const lesson = useLessonStore((state) => state.selected_lesson);
  const SetLessons = useLessonStore((state) => state.SetLessons);
  const is_open = useUiStore((state) => state.popupFormConfirmClass);
  const setIsOpen = useUiStore((state) => state.setPopupFormConfirmClass);

  const OnSubmit = async (form_data) => {
    const confirm_lesson_data = {
      id: lesson?.id,
      lesson_score: parseInt(form_data.get("lesson-score")),
      student_observations: form_data.get("student-observations"),
    };
    await ConfirmLesson(confirm_lesson_data);

    const data = await GetLessons();
    const lessons = FormattedLessons(data, "student");

    SetLessons(lessons);

    console.log(confirm_lesson_data);

    setIsOpen(false);
  };

  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Confirm Class</DialogTitle>
        </DialogHeader>
        <div>
          <form action={OnSubmit} className="grid gap-4">
            <div className={`grid gap-2`}>
              <Label htmlFor="observations">Opinion</Label>
              <Textarea
                id="observations"
                name="student-observations"
                placeholder="Enter class Opinion"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lesson-score">
                Select a score from 1 to 10 for the class
              </Label>
              <span> (where 1 is the lowest rating and 10 is the highest)</span>
              <Select name="lesson-score" id="lesson-score" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit">Confirm</Button>

              <DialogClose asChild>
                <Button variant="outline">Exit</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
