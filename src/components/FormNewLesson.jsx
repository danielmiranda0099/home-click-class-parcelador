"use client";
const moment = require("moment");
import { useUiStore } from "@/store/uiStores";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { InputPriceLesson } from "./InputPriceLesson";
import { InputSearch } from ".";
import { teachers, students } from "@/mockData";
import { CreateNewLesson } from "@/actions/CrudLesson";
import { useLessonStore } from "@/store/lessonStore";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { FormattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";

const DAYS_OF_WEEK = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

const DAYS_OF_WEEK_NUMBER = {
  Do: 0,
  Lu: 1,
  Ma: 2,
  Mi: 3,
  Ju: 4,
  Vi: 5,
  Sa: 6,
};
function getClassDatesForNextPeriod(selected_days, times, period, startDate) {
  const dates = [];
  let currentDate = moment(startDate); // Iniciar desde la fecha proporcionada
  let endDate;

  // Configurar el tiempo final según el parámetro 'period'
  switch (period) {
    case "3M": // 3 meses
      endDate = moment(startDate).add(3, "months");
      break;
    case "6M": // 6 meses
      endDate = moment(startDate).add(6, "months");
      break;
    case "1Y": // 1 año
      endDate = moment(startDate).add(1, "year");
      break;
    default:
      console.error("Período no válido");
      return [];
  }

  while (currentDate.isSameOrBefore(endDate)) {
    if (selected_days.includes(currentDate.day())) {
      const dateWithTime = currentDate
        .clone()
        .hour(times[currentDate.day()].split(":")[0])
        .minute(times[currentDate.day()].split(":")[1]);

      dates.push(dateWithTime.format());
    }
    currentDate.add(1, "days"); // Avanzar al siguiente día
  }

  return dates;
}

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

  const [teacher, setTeacher] = useState("");
  const [student, setStudent] = useState("");
  const [teacher_payment, setTeacherPayment] = useState("");
  const [period_of_time, setPeriodOfTime] = useState("3m");

  const [student_fee, setStudentFee] = useState("");

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

  const OnCreateNewLessons = async () => {
    const student_fee_string = student_fee.replace(/[^0-9]/g, "");
    const student_fee_formated = parseInt(student_fee_string, 10);

    const teacher_payment_string = teacher_payment.replace(/[^0-9]/g, "");
    const teacher_payment_formated = parseInt(teacher_payment_string, 10);

    console.log({
      period_of_time,
      start_date,
    });

    const all_date = getClassDatesForNextPeriod(
      selectedDays.map((day) => DAYS_OF_WEEK_NUMBER[day]),
      times,
      period_of_time,
      start_date
    );
    const lesson = {
      studentId: 23,
      teacherId: 24,
      teacherPayment: teacher_payment_formated,
      studentFee: student_fee_formated,
    };

    const data = all_date.map((time) => ({
      ...lesson,
      startDate: time,
    }));

    const new_lessons = await CreateNewLesson(data);
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

  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[900px] ">
        <DialogHeader className="">
          <DialogTitle>New Class</DialogTitle>
        </DialogHeader>
        <div className="p-0 px-4">
          <div className="space-y-6">
            <div className={`grid grid-cols-2 gap-4`}>
              <div className="grid gap-2">
                <Label>Student</Label>
                <InputSearch
                  value={student}
                  setValue={setStudent}
                  data={students}
                  placeholder="Select a teacher"
                />
              </div>
              <div className="grid gap-2">
                <Label>Price Student Per Hour</Label>
                <InputPriceLesson
                  value={student_fee}
                  setValue={setStudentFee}
                />
              </div>
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

            {/* <div className="flex items-center space-x-2">
              <Checkbox
                id="sameTime"
                checked={sameTimeEachWeek}
                onCheckedChange={(checked) => setSameTimeEachWeek(checked)}
                className="data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-500"
              />
              <Label htmlFor="sameTime">Same time each week</Label>
            </div> */}

            <div className="space-y-4">
              <Label>Select days and times:</Label>
              <div className="grid grid-cols-7 gap-2 ">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className={"flex flex-col items-center"}>
                    <Button
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
          <div className="mt-6 space-x-4 flex justify-end">
            <Button variant="outline">Cancel</Button>
            <Button onClick={OnCreateNewLessons}>Create Class</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
