"use client";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useUiStore } from "@/store/uiStores";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLessonsStore } from "@/store/lessonStore";
import { registerAndSaveLessonReport } from "@/actions/CrudLesson";
import { CheckIcon, CircleCheckIcon } from "@/components/icons";
import { ErrorAlert } from "@/components";
import { useToast } from "@/components/ui/use-toast";

function SubmitButton({ message }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="flex gap-2" disabled={pending}>
      <CheckIcon size={18} />
      {message}
    </Button>
  );
}

export function FormLessonReport({ rol }) {
  const { selected_lesson: lesson, setLessons } = useLessonsStore();
  const {
    popupFormLessonReport: is_open,
    setPopupFormLessonReport: setIsOpen,
  } = useUiStore();
  const [form_state, formActionDispath] = useFormState(
    registerAndSaveLessonReport,
    {
      data: [],
      succes: null,
      error: false,
      message: null,
    }
  );
  const [error_message, setErrorMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (form_state?.success) {
      setLessons(rol, true);
      //TODO: Create componnete toast custom
      toast({
        title: (
          <div className="flex gap-1 items-center">
            <CircleCheckIcon size={"1.8rem"} />
            <p className="font-semibold text-base">
              {lesson.isConfirmed
                ? "Informe guardado y clase registrada."
                : "Informe Guardado"}
            </p>
          </div>
        ),
        variant: "success",
        duration: 5000,
      });
      setIsOpen(false);
    }
    if (form_state.error) {
      setErrorMessage(form_state.message);
    } else {
      setErrorMessage("");
    }
  }, [form_state, setLessons, setIsOpen]);

  const onSubmit = async (form_data) => {
    const form_report_data = Object.fromEntries(form_data.entries());
    form_report_data.lessonId = lesson.id;
    form_report_data.isConfirmed = lesson.isConfirmed;
    formActionDispath(form_report_data);
    setErrorMessage("");
  };

  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px] pt-0">
        <DialogDescription></DialogDescription>
        <DialogHeader className="p-0">
          <DialogTitle>Editar Informe</DialogTitle>
        </DialogHeader>
        <form action={onSubmit}>
          <div className="flex flex-wrap -mx-2 mb-4">
            <div className="w-full sm:w-1/5 px-2 mb-4 sm:mb-0">
              <Label htmlFor="oriented-week" className="block mb-1">
                Oriented Week
              </Label>
              <Textarea
                id="oriented-week"
                name="week"
                className="h-32"
                placeholder="Enter oriented week..."
                defaultValue={lesson?.week || ""}
                required={rol === "teacher"}
              />
            </div>
            <div className="w-full sm:w-1/5 px-2 mb-4 sm:mb-0">
              <Label htmlFor="oriented-topic" className="block mb-1">
                Oriented Topic
              </Label>
              <Textarea
                name="topic"
                id="oriented-topic"
                className="h-32"
                placeholder="Enter oriented topic..."
                defaultValue={lesson?.topic || ""}
                required={rol === "teacher"}
              />
            </div>
            <div className="w-full sm:w-1/5 px-2 mb-4 sm:mb-0">
              <Label htmlFor="observation" className="block mb-1">
                Observation
              </Label>
              <Textarea
                name="teacherObservations"
                id="observation"
                className="h-32"
                placeholder="Enter observation..."
                defaultValue={lesson?.teacherObservations || ""}
                required={rol === "teacher"}
              />
            </div>
            <div className="w-full sm:w-1/5 px-2 mb-4 sm:mb-0">
              <Label htmlFor="issues" className="block mb-1">
                Issues
              </Label>
              <Textarea
                name="issues"
                id="issues"
                className="h-32"
                placeholder="Enter issues..."
                defaultValue={lesson?.issues || ""}
              />
            </div>
            <div className="w-full sm:w-1/5 px-2">
              <Label htmlFor="other" className="block mb-1">
                Other
              </Label>
              <Textarea
                name="otherObservations"
                id="other"
                className="h-32"
                placeholder="Enter other information..."
                defaultValue={lesson?.otherObservations || ""}
              />
            </div>
          </div>
          <ErrorAlert message={error_message} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <SubmitButton
              message={
                lesson?.isConfirmed
                  ? "Guardar Informe y Registrar Clase"
                  : "Guardar Informe"
              }
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
