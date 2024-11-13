"use client";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
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
import { Textarea } from "./ui/textarea";
import { confirmLesson } from "@/actions/CrudLesson";
import { useLessonsStore } from "@/store/lessonStore";
import { CheckIcon } from "@/components/icons";
import { ErrorAlert } from "@/components";
import { useCustomToast } from "@/hooks";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="flex gap-2" disabled={pending}>
      <CheckIcon size={18} />
      {pending ? "Guardando..." : "Guardar"}
    </Button>
  );
}

export function FormConfirmClass() {
  const [form_state, formActionDispath] = useFormState(confirmLesson, {
    data: [],
    succes: null,
    error: false,
    message: null,
  });
  const { selected_lesson: lesson, setLessons } = useLessonsStore();
  const {
    popupFormConfirmClass: is_open,
    setPopupFormConfirmClass: setIsOpen,
  } = useUiStore();
  const [error_message, setErrorMessage] = useState("");
  const { toastSuccess } = useCustomToast();

  useEffect(() => {
    if (form_state?.success) {
      setLessons("student", true);
      toastSuccess({ title: "Clase Confirmada" });
      setIsOpen(false);
    }
    if (form_state.error) {
      setErrorMessage(form_state.message);
    } else {
      setErrorMessage("");
    }
  }, [form_state, setLessons, setIsOpen]);

  const onSubmit = async (form_data) => {
    const confirm_lesson_data = {
      id: lesson?.id,
      teacherId: lesson.teacher.id,
      currentAverageScore: lesson.teacher.averageScore,
      lessonScore: parseInt(form_data.get("lesson_score")),
      studentObservations: form_data.get("student_observations"),
    };

    formActionDispath(confirm_lesson_data);
    setErrorMessage("");
  };

  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Confirm Class</DialogTitle>
        </DialogHeader>
        <div>
          <form action={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lesson-score" className="font-normal">
                Select a score from 1 to 10 for the class{" "}
                <span>
                  (where 1 is the lowest rating and 10 is the highest)
                </span>
              </Label>

              <div className="flex justify-center gap-3">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <div
                    key={num}
                    className="flex flex-col items-center justify-center gap-1"
                  >
                    <input
                      type="radio"
                      value={num}
                      id={`r${num}`}
                      name="lesson_score"
                      required
                      className="sr-only peer"
                    />
                    <Label
                      htmlFor={`r${num}`}
                      className="cursor-pointer p-2 rounded-lg bg-gray-200 peer-checked:bg-blue-500 peer-checked:text-white"
                    >
                      {num}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className={`grid gap-2`}>
              <Label htmlFor="observations">Opinion</Label>
              <Textarea
                id="observations"
                name="student_observations"
                placeholder="Enter class Opinion"
              />
            </div>

            <span className="text-xs">
              *Tu opinión cuenta,puedes evaluar libremente. La evaluación que
              realices será completamente anónima y privada.
            </span>

            <ErrorAlert message={error_message} />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Exit</Button>
              </DialogClose>

              <SubmitButton />
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
