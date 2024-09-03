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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
      lesson_score: parseInt(form_data.get("lesson_score")),
      student_observations: form_data.get("student_observations"),
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
            <div className="grid gap-2">
              <Label htmlFor="lesson-score">
                Select a score from 1 to 10 for the class{" "}
                <span>
                  (where 1 is the lowest rating and 10 is the highest)
                </span>
              </Label>

              <RadioGroup name="lesson_score">
                <div className="flex justify-center gap-3">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <RadioGroupItem value="1" id="r1" />
                    <Label htmlFor="r1">1</Label>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <RadioGroupItem value="2" id="r2" />
                    <Label htmlFor="r2">2</Label>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <RadioGroupItem value="3" id="r3" />
                    <Label htmlFor="r3">3</Label>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <RadioGroupItem value="4" id="r4" />
                    <Label htmlFor="r4">4</Label>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <RadioGroupItem value="5" id="r5" />
                    <Label htmlFor="r5">5</Label>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <RadioGroupItem value="6" id="r6" />
                    <Label htmlFor="r6">6</Label>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <RadioGroupItem value="7" id="r7" />
                    <Label htmlFor="r7">7</Label>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <RadioGroupItem value="8" id="r8" />
                    <Label htmlFor="r8">8</Label>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <RadioGroupItem value="9" id="r9" />
                    <Label htmlFor="r9">9</Label>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <RadioGroupItem value="10" id="r10" />
                    <Label htmlFor="r10">10</Label>
                  </div>
                </div>
              </RadioGroup>

              {/* <Select name="lesson-score" id="lesson-score" required>
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
              </Select> */}
            </div>

            <div className={`grid gap-2`}>
              <Label htmlFor="observations">Opinion</Label>
              <Textarea
                id="observations"
                name="student_observations"
                placeholder="Enter class Opinion"
                required
              />
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
