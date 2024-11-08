"use client";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useLessonsStore } from "@/store/lessonStore";
import { useUiStore } from "@/store/uiStores";

import { formattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";
import { DATA_LESSON_DEFAULT, DAYS_OF_WEEK_NUMBER } from "@/utils/constans";

import { CreateNewLesson, getLessons } from "@/actions/CrudLesson";
import { PeriodOfTime } from "./PeriodOfTime";
import { SelectedDaysAndTime } from "./SelectedDaysAndTime";
import { FormFieldStudents } from "./FormFieldStudents";
import { FormFieldTeacher } from "./FormFieldTeacher";
import { XIcon } from "@/components/icons";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "scheduling classes.." : "schedule classes"}
    </Button>
  );
}

export function FormCreateNewLesson() {
  const { lessons, setLessons } = useLessonsStore();
  const { setPopupFormCreateNewLesson: setIsOpen } = useUiStore();
  const [data_lesson, setDataLesson] = useState(DATA_LESSON_DEFAULT);
  const [state_form, dispath] = useFormState(CreateNewLesson, {
    data: [],
    succes: null,
    error: false,
    message: null,
  });

  useEffect(() => {
    console.log(state_form);
    if (state_form?.success) {
      handlerGetLesson();
    }
  }, [state_form]);

  const handlerGetLesson = async () => {
    //TODO: Teiene sentido enviar "admin2?? si el que crea clases siempre es admin ademas el rol
    //debe de obtenerse por el user
    const lessons = await getLessons();
    const lessons_formated = formattedLessonsForCalendar(lessons, "admin");
    setLessons(lessons_formated);
    setIsOpen(false);
  };

  const OnCreateNewLessons = async () => {
    dispath(data_lesson);
  };
  return (
    <form className="p-0 px-4" action={OnCreateNewLessons}>
      <div className="space-y-4">
        <FormFieldStudents
          data_lesson={data_lesson}
          setDataLesson={setDataLesson}
        />

        <FormFieldTeacher
          data_lesson={data_lesson}
          setDataLesson={setDataLesson}
        />

        <PeriodOfTime data_lesson={data_lesson} setDataLesson={setDataLesson} />

        <div className="flex space-x-4 items-center">
          <Label htmlFor="start_date">Fecha de inicio:</Label>
          <Input
            type="date"
            id="start_date"
            value={data_lesson.startDate}
            onChange={(event) =>
              setDataLesson({
                ...data_lesson,
                startDate: event.target.value,
              })
            }
            className="w-[fit-content]"
          />
        </div>

        <SelectedDaysAndTime
          data_lesson={data_lesson}
          setDataLesson={setDataLesson}
        />
      </div>
      {/* TODO: converit el error en componente y hacer que desaparesca a los 6s o cuando se le al boton de accion*/}
      {state_form.error && (
        <div className="mt-3 bg-red-500 p-3 rounded-sm flex">
          <XIcon color="white" />
          <p className="text-white font-semibold ml-1">{state_form.message}</p>
        </div>
      )}
      <DialogFooter>
        <div className="mt-6 space-x-4 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <SubmitButton />
        </div>
      </DialogFooter>
    </form>
  );
}
