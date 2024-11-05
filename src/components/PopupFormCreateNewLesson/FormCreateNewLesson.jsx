"use client";
import { useState } from "react";
import moment from "moment";

import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useLessonStore } from "@/store/lessonStore";

import { getClassDatesForNextPeriod } from "@/utils/getClassDatesForNextPeriod";
import { FormattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";
import { DAYS_OF_WEEK_NUMBER } from "@/utils/constans";

import { CreateNewLesson } from "@/actions/CrudLesson";
import { PeriodOfTime } from "./PeriodOfTime";
import { SelectedDaysAndTime } from "./SelectedDaysAndTime";
import { FormFieldStudents } from "./FormFieldStudents";
import { FormFieldTeacher } from "./FormFieldTeacher";

export function FormCreateNewLesson() {
  const { lessons, SetLessons } = useLessonStore();

  const [data_lesson, setDataLesson] = useState({
    students: [{ student: null, fee: "" }],
    teacher: {
      teacher: null,
      payment: "",
    },
    periodOfTime: "",
    startDate: moment().format("YYYY-MM-DD"),
    selectedDays: [],
    times: {},
  });

  const OnCreateNewLessons = async (form_data) => {
    const teacher_payment_string = data_lesson.teacher.payment.replace(
      /[^0-9]/g,
      ""
    );
    const teacher_payment_formated = parseInt(teacher_payment_string, 10);

    form_data.forEach((value, key) => console.log(`${key}: ${value}`));

    const student_lesson_data = data_lesson.students.map((data) => ({
      studentId: data.student.id,
      studentFee: parseInt(data.fee.replace(/[^0-9]/g, ""), 10),
    }));

    const all_date = getClassDatesForNextPeriod(
      data_lesson.selectedDays.map((day) => DAYS_OF_WEEK_NUMBER[day]),
      data_lesson.times,
      data_lesson.periodOfTime,
      data_lesson.startDate
    );

    const lesson = {
      teacherId: data_lesson.teacher.teacher?.id,
      teacherPayment: teacher_payment_formated,
    };

    const data = all_date.map((time) => ({
      ...lesson,
      isGroup: student_lesson_data.length > 1,
      startDate: time,
      studentLessons: {
        create: student_lesson_data,
      },
    }));
    console.log(data);
    // const new_lessons = await CreateNewLesson(data_lesson);
    //TODO: Teiene sentido enviar "admin2?? si el que crea clases siempre es admin ademas el rol
    //debe de obtenerse por el user
    // const new_lessons_formated = FormattedLessonsForCalendar(
    //   new_lessons,
    //   "admin"
    // );
    // const all_lessons = [...lessons, ...new_lessons_formated];
    // console.log(all_lessons);
    // setLessons(all_lessons);
    // setIsOpen(false);
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
      <DialogFooter>
        <div className="mt-6 space-x-4 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Create Class</Button>
        </div>
      </DialogFooter>
    </form>
  );
}
