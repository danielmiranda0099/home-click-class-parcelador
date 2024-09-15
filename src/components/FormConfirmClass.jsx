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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "./ui/textarea";
import { ConfirmLesson, GetLessons } from "@/actions/CrudLesson";
import { useLessonStore } from "@/store/lessonStore";
import { FormattedLessons } from "@/utils/formattedLessons";
import { StarRating } from "./StartRating";
import { useState } from "react";

export function FormConfirmClass() {
  const [rating, setRating] = useState(0);
  const lesson = useLessonStore((state) => state.selected_lesson);
  const SetLessons = useLessonStore((state) => state.SetLessons);
  const is_open = useUiStore((state) => state.popupFormConfirmClass);
  const setIsOpen = useUiStore((state) => state.setPopupFormConfirmClass);

  const OnSubmit = async (form_data) => {
    const confirm_lesson_data = {
      id: lesson?.id,
      lesson_score: rating,
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
              <StarRating rating={rating} setRating={setRating} />
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

            <span>
              *Tu opinión cuenta,puedes evaluar libremente. La evaluación que
              realices será completamente anónima y privada.
            </span>

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
