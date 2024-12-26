import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "..";
import { useCustomToast } from "@/hooks";
import { deleteLessons } from "@/actions/CrudLesson";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="destructive"
      type="submit"
      disabled={pending}
      className="flex gap-1 justify-center items-center"
    >
      Si, continuar
    </Button>
  );
}

export function PopupDeleteLesson({
  is_open_popup_delete,
  setIsOpenPopupDelete,
  lesson_id,
  handleAction = null,
}) {
  const [form_state_form_delete_lesson, dispathFormDeleteLesson] =
    useFormState(deleteLessons, {
      data: [],
      success: null,
      error: false,
      message: null,
    });

  const [
    error_message_form_delete_lesson,
    setErrorMessageFormDeleteLesson,
  ] = useState("");

  const { toastSuccess } = useCustomToast();

  const onDeleteLesson = () => {
    setErrorMessageFormDeleteLesson("");
    dispathFormDeleteLesson([lesson_id]);
  };

  useEffect(() => {
    setErrorMessageFormDeleteLesson("");
    if (form_state_form_delete_lesson?.success) {
      toastSuccess({ title: "Clase eliminada exitosamente." });
      setIsOpenPopupDelete(false);
      if (handleAction) {
        handleAction();
      }
    }
    if (
      form_state_form_delete_lesson?.error &&
      error_message_form_delete_lesson.length === 0
    ) {
      setErrorMessageFormDeleteLesson(
        form_state_form_delete_lesson.message
      );
    }
  }, [form_state_form_delete_lesson]);

  return (
    <Dialog
      open={is_open_popup_delete}
      onOpenChange={(open) => {
        if (!open) {
          setErrorMessageFormDeleteLesson("");
        }
        setIsOpenPopupDelete(open);
      }}
    >
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>¿Estás seguro de eliminar esta clase?</DialogTitle>
          <DialogDescription>
            Esta acción no puede deshacerse.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form className="flex flex-col w-full" action={onDeleteLesson}>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setErrorMessageFormDeleteLesson("");
                  setIsOpenPopupDelete(false);
                }}
              >
                Cancelar
              </Button>
              <SubmitButton />
            </div>

            <div className="flex flex-1 w-full">
              <ErrorAlert message={error_message_form_delete_lesson} />
            </div>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
