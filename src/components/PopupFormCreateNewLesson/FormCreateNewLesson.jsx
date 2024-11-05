"use client";
import { useEffect, useState } from "react";
import moment from "moment";

import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputPriceLesson } from "@/components/InputPriceLesson";
import { InputSearch } from "@/components/InputSearch";
import { PlusCircleIcon } from "@/components/icons";

import { useLessonStore } from "@/store/lessonStore";
import { useUserStore } from "@/store/userStore";

import { getClassDatesForNextPeriod } from "@/utils/getClassDatesForNextPeriod";
import { FormattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";
import { formatUsersForInputSearch } from "@/utils/formatUsersForInputSearch";
import { DAYS_OF_WEEK, DAYS_OF_WEEK_NUMBER } from "@/utils/constans";

import { CreateNewLesson } from "@/actions/CrudLesson";
import { PeriodOfTime } from "./PeriodOfTime";

export function FormCreateNewLesson() {
  const { lessons, SetLessons } = useLessonStore();
  const { users } = useUserStore();
  const [teachers_for_input_search, setTeachersForInputSearh] = useState([]);
  const [students_for_input_search, setStudentsForInputSearh] = useState([]);

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

  //TODO: eliminar useeffect o que se actulice los inputs cuando se crea un user sin necesitar del useeffects o pasarlo a un CUSTOM HOOK
  useEffect(() => {
    const students_formated = formatUsersForInputSearch(users, "student");
    const teachers_formated = formatUsersForInputSearch(users, "teacher");

    setStudentsForInputSearh(students_formated);
    setTeachersForInputSearh(teachers_formated);
  }, [users]);

  const handleDaySelect = (day) => {
    setDataLesson({
      ...data_lesson,
      selectedDays: data_lesson.selectedDays.includes(day)
        ? data_lesson.selectedDays.filter((d) => d !== day)
        : [...data_lesson.selectedDays, day],
    });
  };

  const handleTimeChange = (day, time) => {
    setDataLesson({
      ...data_lesson,
      times: { ...data_lesson.times, [DAYS_OF_WEEK_NUMBER[day]]: time },
    });
    // setTimes((prev) => ({ ...prev, [DAYS_OF_WEEK_NUMBER[day]]: time }));
  };

  const addNewStudent = () => {
    setDataLesson({
      ...data_lesson,
      students: [...data_lesson.students, { student: null, fee: "" }],
    });
  };

  const updateStudentData = (index, field, value) => {
    const newStudentsData = [...data_lesson.students];
    newStudentsData[index][field] = value;
    setDataLesson({ ...data_lesson, students: newStudentsData });
  };

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
        {data_lesson.students.map((studentData, index) => (
          <div key={index} className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Student</Label>
              <InputSearch
                value={studentData.student}
                setValue={(value) => updateStudentData(index, "student", value)}
                data={students_for_input_search}
                placeholder="Select a student"
              />
            </div>
            <div className="grid gap-2">
              <Label>Price StudentPer Hour</Label>
              <InputPriceLesson
                value={studentData.fee}
                setValue={(value) => updateStudentData(index, "fee", value)}
              />
            </div>
          </div>
        ))}

        <div className="flex items-center">
          <Button
            variant="outline"
            className="flex gap-2"
            type="button"
            onClick={addNewStudent}
          >
            Nuevo Etudiante
            <PlusCircleIcon />
          </Button>
        </div>

        <div className={`grid grid-cols-2 gap-4`}>
          <div className="grid gap-2">
            <Label>Teacher</Label>
            <InputSearch
              value={data_lesson.teacher.teacher}
              setValue={(value) =>
                setDataLesson({
                  ...data_lesson,
                  teacher: { ...data_lesson.teacher, teacher: value },
                })
              }
              data={teachers_for_input_search}
              placeholder="Select a teacher"
            />
          </div>
          <div className="grid gap-2">
            <Label>Price Teacher</Label>
            <InputPriceLesson
              value={data_lesson.teacher.payment}
              setValue={(value) =>
                setDataLesson({
                  ...data_lesson,
                  teacher: { ...data_lesson.teacher, payment: value },
                })
              }
            />
          </div>
        </div>

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

        <div className="space-y-4">
          <Label>Select days and times:</Label>
          <div className="grid grid-cols-7 gap-2 ">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className={"flex flex-col items-center"}>
                <Button
                  type="button"
                  variant={
                    data_lesson.selectedDays.includes(day)
                      ? "default"
                      : "outline"
                  }
                  className={`w-10 h-10 hover:bg-blue-600 hover:text-white ${data_lesson.selectedDays.includes(day) && "bg-blue-400"}`}
                  onClick={() => handleDaySelect(day)}
                >
                  {day}
                </Button>
                <Input
                  type="time"
                  className={`w-full mt-2 border-gray-500 ${data_lesson.selectedDays.includes(day) && "border-blue-500"}`}
                  value={data_lesson.times[DAYS_OF_WEEK_NUMBER[day]] || ""}
                  onChange={(e) => handleTimeChange(day, e.target.value)}
                  disabled={!data_lesson.selectedDays.includes(day)}
                />
              </div>
            ))}
          </div>
        </div>
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
