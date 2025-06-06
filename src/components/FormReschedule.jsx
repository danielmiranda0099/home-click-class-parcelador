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
import { useSearchParams } from "next/navigation";

export function FormReschedule() {
  const { popupFormReschedule: is_open, setPopupFormReschedule: setIsOpen } =
    useUiStore();
  const { setLessons, selected_lesson } = useLessonsStore();
  const [form_state, setFormState] = useState({
    pending: false,
    errorMessage: "",
  });
  const searchParams = useSearchParams();
  const { toastSuccess } = useCustomToast();

  const getDateRangeFromUrl = () => {
    return {
      startOfMonth: new Date(
        parseInt(searchParams.get("year")),
        parseInt(searchParams.get("month")) - 1,
        1
      ),
      endOfMonth: new Date(
        parseInt(searchParams.get("year")),
        parseInt(searchParams.get("month")),
        0
      ),
    };
  };

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
        setLessons(getDateRangeFromUrl(), true);
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
      <DialogContent className="sm:max-w-[700px] pt-0 overflow-y-scroll max-h-[85vh]">
        <DialogDescription></DialogDescription>
        <DialogHeader className="p-0">
          <DialogTitle className="text-left">Reschedule Class</DialogTitle>
        </DialogHeader>
        <div>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">New Date*</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="datetime-local"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="reason">Reason Reschedule</label>
              <Textarea id="reason" name="reason" />
            </div>

            <ErrorAlert message={form_state.errorMessage} />

            <DialogFooter className="gap-2">
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
