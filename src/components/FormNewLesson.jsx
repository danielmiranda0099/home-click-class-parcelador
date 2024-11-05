"use client";
const moment = require("moment");
import { useUiStore } from "@/store/uiStores";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputPriceLesson } from "./InputPriceLesson";
import { InputSearch } from ".";
import { CreateNewLesson } from "@/actions/CrudLesson";
import { useLessonStore } from "@/store/lessonStore";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { FormattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";
import { useUserStore } from "@/store/userStore";
import { formatUsersForInputSearch } from "@/utils/formatUsersForInputSearch";
import { PlusCircleIcon } from "./icons";
import { DAYS_OF_WEEK, DAYS_OF_WEEK_NUMBER } from "@/utils/constans";
import { getClassDatesForNextPeriod } from "@/utils/getClassDatesForNextPeriod";

export function FormNewLesson() {
  const is_open = useUiStore((state) => state.popupFormNewLesson);
  const setIsOpen = useUiStore((state) => state.setPopupFormNewLesson);
  const lessons = useLessonStore((state) => state.lessons);
  const setLessons = useLessonStore((state) => state.SetLessons);
  const [selectedDays, setSelectedDays] = useState([]);
  const [sameTimeEachWeek, setSameTimeEachWeek] = useState(false);
  const [times, setTimes] = useState({});
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [start_date, setStartDate] = useState(moment().format("YYYY-MM-DD"));

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [student, setStudent] = useState(null);
  const [teacher_payment, setTeacherPayment] = useState("");
  const [period_of_time, setPeriodOfTime] = useState("3m");

  const [student_fee, setStudentFee] = useState("");

  const { users } = useUserStore();

  useEffect(() => {
    const students_formated = formatUsersForInputSearch(users, "student");
    const teachers_formated = formatUsersForInputSearch(users, "teacher");

    setStudents(students_formated);
    setTeachers(teachers_formated);
  }, [users]);

  const handleDaySelect = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleTimeChange = (day, time) => {
    if (sameTimeEachWeek) {
      const newTimes = selectedDays.reduce(
        (acc, d) => ({ ...acc, [d]: time }),
        {}
      );
      setTimes(newTimes);
    } else {
      setTimes((prev) => ({ ...prev, [DAYS_OF_WEEK_NUMBER[day]]: time }));
    }
  };

  const OnCreateNewLessons = async (form_data) => {
    const student_fee_string = student_fee.replace(/[^0-9]/g, "");
    const student_fee_formated = parseInt(student_fee_string, 10);

    const teacher_payment_string = teacher_payment.replace(/[^0-9]/g, "");
    const teacher_payment_formated = parseInt(teacher_payment_string, 10);

    console.log({
      period_of_time,
      start_date,
    });

    console.log(students_data);

    form_data.forEach((value, key) => console.log(`${key}: ${value}`));

    const student_lesson_data = students_data.map((data) => ({
      studentId: data.student.id,
      studentFee: parseInt(data.fee.replace(/[^0-9]/g, ""), 10),
    }));

    const all_date = getClassDatesForNextPeriod(
      selectedDays.map((day) => DAYS_OF_WEEK_NUMBER[day]),
      times,
      period_of_time,
      start_date
    );

    const lesson = {
      teacherId: teacher?.id,
      teacherPayment: teacher_payment_formated,
    };

    const data_lesson = all_date.map((time) => ({
      ...lesson,
      isGroup: student_lesson_data.length > 1,
      startDate: time,
      studentLessons: {
        create: student_lesson_data,
      },
    }));

    const new_lessons = await CreateNewLesson(data_lesson);
    //TODO: Teiene sentido enviar "admin2?? si el que crea clases siempre es admin ademas el rol
    //debe de obtenerse por el user
    const new_lessons_formated = FormattedLessonsForCalendar(
      new_lessons,
      "admin"
    );
    const all_lessons = [...lessons, ...new_lessons_formated];
    console.log(all_lessons);
    setLessons(all_lessons);
    setIsOpen(false);
  };

  const [students_data, setStudentsData] = useState([
    { student: null, fee: "" },
  ]);

  const addNewStudent = () => {
    setStudentsData([...students_data, { student: null, fee: "" }]);
  };

  const updateStudentData = (index, field, value) => {
    const newStudentsData = [...students_data];
    newStudentsData[index][field] = value;
    setStudentsData(newStudentsData);
  };

  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[900px] overflow-y-scroll max-h-[95vh]">
        <DialogHeader className="">
          <DialogTitle>New Class</DialogTitle>
        </DialogHeader>
        <form className="p-0 px-4" action={OnCreateNewLessons}>
          <div className="space-y-4">
            {students_data.map((studentData, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Student</Label>
                  <InputSearch
                    value={studentData.student}
                    setValue={(value) =>
                      updateStudentData(index, "student", value)
                    }
                    data={formatUsersForInputSearch(users, "student")}
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
                  value={teacher}
                  setValue={setTeacher}
                  data={teachers}
                  placeholder="Select a teacher"
                />
              </div>
              <div className="grid gap-2">
                <Label>Price Teacher</Label>
                <InputPriceLesson
                  value={teacher_payment}
                  setValue={setTeacherPayment}
                />
              </div>
            </div>

            <RadioGroup
              className="flex space-x-4 items-center"
              value={period_of_time}
              onValueChange={(value) => setPeriodOfTime(value)}
            >
              <Label>Periodo de tiempo:</Label>
              <div className="flex items-center">
                <RadioGroupItem value="3M" id="r1" className="sr-only" />
                <Label
                  htmlFor="r1"
                  className={`flex items-center justify-center px-3 py-2 text-sm border rounded-md cursor-pointer 
                   ${period_of_time === "3M" && "bg-blue-400 text-white"}`}
                >
                  3 Meses
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="6M" id="r2" className="sr-only peer" />
                <Label
                  htmlFor="r2"
                  className={`flex items-center justify-center px-3 py-2 text-sm border rounded-md cursor-pointer 
                   ${period_of_time === "6M" && "bg-blue-400 text-white"}`}
                >
                  6 Meses
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="1Y" id="r3" className="sr-only peer" />
                <Label
                  htmlFor="r3"
                  className={`flex items-center justify-center px-3 py-2 text-sm border rounded-md cursor-pointer 
                   ${period_of_time === "1Y" && "bg-blue-400 text-white"}`}
                >
                  1 Año
                </Label>
              </div>
            </RadioGroup>

            <div className="flex space-x-4 items-center">
              <Label htmlFor="start_date">Fecha de inicio:</Label>
              <Input
                type="date"
                id="start_date"
                value={start_date}
                onChange={(event) => setStartDate(event.target.value)}
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
                        selectedDays.includes(day) ? "default" : "outline"
                      }
                      className={`w-10 h-10 hover:bg-blue-600 hover:text-white ${selectedDays.includes(day) && "bg-blue-400"}`}
                      onClick={() => handleDaySelect(day)}
                    >
                      {day}
                    </Button>
                    <Input
                      type="time"
                      className={`w-full mt-2 border-gray-500 ${selectedDays.includes(day) && "border-blue-500"}`}
                      value={times[DAYS_OF_WEEK_NUMBER[day]] || ""}
                      onChange={(e) => handleTimeChange(day, e.target.value)}
                      disabled={
                        !selectedDays.includes(day) ||
                        (sameTimeEachWeek && day !== selectedDays[0])
                      }
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
      </DialogContent>
    </Dialog>
  );
}
