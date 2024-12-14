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

export function PopupDeleteTransaction({
  is_open_popup_delete,
  setIsOpenPopupDelete,
  transactionId,
  handleDispath,
  handleAction = null,
}) {
  const [form_state_form_delete_transactiom, dispathFormDeleteTransactiom] =
    useFormState(handleDispath, {
      data: [],
      success: null,
      error: false,
      message: null,
    });

  const [
    error_message_form_delete_transactiom,
    setErrorMessageFormDeleteTransactiom,
  ] = useState("");

  const { toastSuccess } = useCustomToast();

  const onDeleteTransaction = () => {
    setErrorMessageFormDeleteTransactiom("");
    dispathFormDeleteTransactiom([transactionId]);
  };

  useEffect(() => {
    setErrorMessageFormDeleteTransactiom("");
    if (form_state_form_delete_transactiom.success) {
      toastSuccess({ title: "Movimiento eliminado exitosamente." });
      setIsOpenPopupDelete(false);
      if (handleAction) {
        handleAction();
      }
    }
    if (
      form_state_form_delete_transactiom.error &&
      error_message_form_delete_transactiom.length === 0
    ) {
      setErrorMessageFormDeleteTransactiom(
        form_state_form_delete_transactiom.message
      );
    }
  }, [form_state_form_delete_transactiom]);

  return (
    <Dialog
      open={is_open_popup_delete}
      onOpenChange={(open) => {
        if (!open) {
          setErrorMessageFormDeleteTransactiom("");
        }
        setIsOpenPopupDelete(open);
      }}
    >
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>¿Estás seguro de eliminar este movimiento?</DialogTitle>
          <DialogDescription>
            Esta acción no puede deshacerse.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form className="flex flex-col w-full" action={onDeleteTransaction}>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setErrorMessageFormDeleteTransactiom("");
                  setIsOpenPopupDelete(false);
                }}
              >
                Cancelar
              </Button>
              <SubmitButton />
            </div>

            <div className="flex flex-1 w-full">
              <ErrorAlert message={error_message_form_delete_transactiom} />
            </div>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
