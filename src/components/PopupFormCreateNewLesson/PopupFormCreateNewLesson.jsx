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
      <DialogContent className="sm:max-w-[900px] overflow-y-scroll max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>New Class</DialogTitle>
        </DialogHeader>
        <FormCreateNewLesson />
      </DialogContent>
    </Dialog>
  );
}
