import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function PopupScheduleAlert({
  is_open_popup_alert,
  setIsOpenPopupAlert,
  handleAction = null,
  message,
}) {
  const onDeleteLesson = () => {
    setIsOpenPopupAlert(false);
    handleAction();
  };

  return (
    <Dialog open={is_open_popup_alert} onOpenChange={setIsOpenPopupAlert}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Hay Horario repetido o solapado.</DialogTitle>
          <DialogDescription>
            <p className="text- text-red-400">{message}</p>
            <br />
            Por favor verifique bien antes de continuar.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form className="flex flex-col w-full" action={onDeleteLesson}>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpenPopupAlert(false);
                }}
              >
                Cancelar
              </Button>
              <Button>Continuar</Button>
            </div>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
