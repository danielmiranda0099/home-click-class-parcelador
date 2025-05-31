import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export function DialogDisconfirmLesson({
  is_open_dialog_disconfirm,
  setIsOpenDialogDisconfirm,
  handleAction = null,
}) {
  return (
    <Dialog
      open={is_open_dialog_disconfirm}
      onOpenChange={(open) => {
        setIsOpenDialogDisconfirm(open);
      }}
    >
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>¿Esta seguro de esta acción?</DialogTitle>
          <DialogDescription>
            Esta acción no puede deshacerse.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpenDialogDisconfirm(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="flex gap-1 justify-center items-center"
              onClick={async () => {
                if (handleAction) {
                  await handleAction();
                }
                setIsOpenDialogDisconfirm(false);
              }}
            >
              Si, continuar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
