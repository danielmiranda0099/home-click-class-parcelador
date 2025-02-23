"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { CalendarIcon } from "@/components/icons";
import { FormWeeklySchedule } from "./FormWeeklySchedule";

export function PopupFormWeeklySchedule({
  is_open,
  setIsOpen,
  userId,
  userSchedule,
}) {
  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2 w-fit">
          <CalendarIcon className="h-4 w-4" /> Editar Horario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] px-2 sm:px-6 overflow-y-scroll max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-left">Edit Schedule</DialogTitle>
        </DialogHeader>
        <FormWeeklySchedule
          userId={userId}
          userSchedule={userSchedule}
          setIsOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
