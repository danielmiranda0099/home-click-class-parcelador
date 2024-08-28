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

  const OnSubmit = async () => {
    await ConfirmLesson(lesson?.id);

    const data = await GetLessons();
    const lessons = FormattedLessons(data, "student");

    SetLessons(lessons);

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
              <Label htmlFor="topic">Opinion</Label>
              <Textarea
                id="topic"
                name="topic"
                placeholder="Enter class topic"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="participants">
                Select a score from 1 to 10 for the class
              </Label>
              <span> (where 1 is the lowest rating and 10 is the highest)</span>
              <Select id="participants">
                <SelectTrigger>
                  <SelectValue placeholder="Select Rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="participant1">1</SelectItem>
                  <SelectItem value="participant2">2</SelectItem>
                  <SelectItem value="participant3">3</SelectItem>
                  <SelectItem value="participant4">4</SelectItem>
                  <SelectItem value="participant5">5</SelectItem>
                  <SelectItem value="participant6">6</SelectItem>
                  <SelectItem value="participant7">7</SelectItem>
                  <SelectItem value="participant8">8</SelectItem>
                  <SelectItem value="participant9">9</SelectItem>
                  <SelectItem value="participant10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="primary" type="submit">
                Confirm
              </Button>

              <DialogClose asChild>
                <Button>Exit</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
