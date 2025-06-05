"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUiStore } from "@/store/uiStores";
import { FormCreateNewLesson } from "./FormCreateNewLesson";

export function PopupFormCreateNewLesson() {
  const {
    popupFormCreateNewLesson: is_open,
    setPopupFormCreateNewLesson: setIsOpen,
  } = useUiStore();

  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[900px] px-2 sm:px-6 overflow-y-scroll max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-left">Schedule New Classes</DialogTitle>
        </DialogHeader>
        <FormCreateNewLesson />
      </DialogContent>
    </Dialog>
  );
}
