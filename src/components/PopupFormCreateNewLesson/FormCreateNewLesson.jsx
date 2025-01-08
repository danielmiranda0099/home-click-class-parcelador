"use client";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useLessonsStore } from "@/store/lessonStore";
import { useUiStore } from "@/store/uiStores";

import { DATA_LESSON_DEFAULT, DAYS_OF_WEEK_NUMBER } from "@/utils/constans";

import { CreateNewLesson } from "@/actions/CrudLesson";
import { PeriodOfTime } from "./PeriodOfTime";
import { SelectedDaysAndTime } from "./SelectedDaysAndTime";
import { FormFieldStudents } from "./FormFieldStudents";
import { FormFieldTeacher } from "./FormFieldTeacher";
import { ErrorAlert } from "@/components";
import { useCustomToast } from "@/hooks";
import moment from "moment";
import { scheduleLessons } from "@/utils/scheduleLessons";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "scheduling classes.." : "schedule classes"}
    </Button>
  );
}

export function FormCreateNewLesson() {
  const { setLessons } = useLessonsStore();
  const { setPopupFormCreateNewLesson: setIsOpen } = useUiStore();
  const [data_lesson, setDataLesson] = useState(DATA_LESSON_DEFAULT);
  const [form_state, dispath] = useFormState(CreateNewLesson, {
    data: [],
    succes: null,
    error: false,
    message: null,
  });
  const [error_message, setErrorMessage] = useState("");
  const { toastSuccess } = useCustomToast();

  useEffect(() => {
    console.log(form_state);
    if (form_state?.success) {
      toastSuccess({ title: "Clases creadas." });
      // setLessons("admin");
      // setIsOpen(false);
    }
    if (form_state?.error) {
      setErrorMessage(form_state.message);
    } else {
      setErrorMessage("");
    }
  }, [form_state]);

  const OnCreateNewLessons = async () => {
    setErrorMessage("");
    console.log(data_lesson);
    const all_dates = scheduleLessons(
      data_lesson.selectedDays,
      data_lesson.times,
      data_lesson.periodOfTime,
      data_lesson.startDate
    )

    console.log("********* all_date *******", all_dates);
    data_lesson.allDates = all_dates;

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

      <ErrorAlert message={error_message} />

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
