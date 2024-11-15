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
} from "@/components/ui/dialog";
import { useLessonsStore } from "@/store/lessonStore";
import { rescheduleLesson } from "@/actions/CrudLesson";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formattedDateForInput } from "@/utils/formattedDateForInput";
import { CheckIcon } from "@/components/icons";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ErrorAlert } from ".";
import { useCustomToast } from "@/hooks";

export function FormReschedule({ rol }) {
  const { popupFormReschedule: is_open, setPopupFormReschedule: setIsOpen } =
    useUiStore();
  const { setLessons, selected_lesson } = useLessonsStore();
  const [form_state, setFormState] = useState({
    pending: false,
    errorMessage: "",
  });
  const { toastSuccess } = useCustomToast();

  const onSubmit = (event) => {
    event.preventDefault();
    const form_data = new FormData(event.currentTarget);
    setFormState((prev) => ({ ...prev, pending: true }));
    const new_date = {
      id: selected_lesson?.id,
      startDate: new Date(form_data.get("start_date")),
      reasonsRescheduled: form_data.get("reason"),
    };

    rescheduleLesson(new_date).then((response) => {
      setFormState((prev) => ({ ...prev, pending: false }));
      if (response.success) {
        toastSuccess({ title: "Clase reagendada." });
        setFormState((prev) => ({ ...prev, errorMessage: "" }));
        setLessons(rol);
        setIsOpen(false);
      }
      if (response.error) {
        setFormState((prev) => ({ ...prev, errorMessage: response.message }));
      }
    });
    setFormState((prev) => ({ ...prev, errorMessage: "" }));
  };

  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px] pt-0">
        <DialogDescription></DialogDescription>
        <DialogHeader className="p-0">
          <DialogTitle>Reschedule Class</DialogTitle>
        </DialogHeader>
        <div>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
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

            <div className="flex flex-col gap-2">
              <label htmlFor="reason">Reason Reschedule</label>
              <Textarea id="reason" name="reason" />
            </div>

            <ErrorAlert message={form_state.errorMessage} />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </DialogClose>

              <Button className="flex gap-2" disabled={form_state.pending}>
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
