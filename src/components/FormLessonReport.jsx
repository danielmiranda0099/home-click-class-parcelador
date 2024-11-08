"use client";
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
import { getLessons, UpdateLesson } from "@/actions/CrudLesson";
import { formattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";
import { CheckIcon } from "./icons";

export function FormLessonReport({ rol }) {
  const { selected_lesson: lesson, setLessons } = useLessonsStore();
  const {
    popupFormLessonReport: is_open,
    setPopupFormLessonReport: setIsOpen,
  } = useUiStore();

  const onSubmit = async (form_data) => {
    if (!lesson) return;
    if (lesson?.isConfirmed) {
      form_data.append("isRegistered", true);
    }

    await UpdateLesson(lesson?.id, form_data);

    const data = await getLessons();
    const lessons = formattedLessonsForCalendar(data, rol);

    setLessons(lessons);

    setIsOpen(false);
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

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" className="flex gap-2">
              <CheckIcon size={18} />
              {lesson?.isConfirmed ? "Registrar Clase" : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
