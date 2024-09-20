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
import { teachers } from "@/mockData";
import { CreateNewLesson } from "@/actions/CrudLesson";
import { useLessonStore } from "@/store/lessonStore";

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

function getClassDatesForNextYear(selected_days, times) {
  // const hour = "10:00"; // Hora de la clase
  const dates = [];
  let currentDate = moment();
  const endDate = moment().add(1, "year"); // Un año desde hoy

  while (currentDate.isSameOrBefore(endDate)) {
    if (selected_days.includes(currentDate.day())) {
      // Crear una copia de la fecha actual y agregar la hora
      const dateWithTime = currentDate
        .clone()
        .hour(times[currentDate.day()].split(":")[0])
        .minute(times[currentDate.day()].split(":")[1]);

      dates.push(dateWithTime.format());
    }
    currentDate.add(1, "days"); // Avanzar al siguiente día
  }
  // console.log(dates);
  return dates;
}

export function FormNewLesson() {
  const is_open = useUiStore((state) => state.popupFormNewLesson);
  const setIsOpen = useUiStore((state) => state.setPopupFormNewLesson);
  const AddNewLesson = useLessonStore((state) => state.AddNewLesson);
  const [selectedDays, setSelectedDays] = useState([]);
  const [sameTimeEachWeek, setSameTimeEachWeek] = useState(false);
  const [times, setTimes] = useState({});
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [teacher, setTeacher] = useState("");
  const [teacher_payment, setTeacherPayment] = useState("");

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

  const OnCreateNewStudent = async () => {
    const student_fee_string = student_fee.replace(/[^0-9]/g, "");
    const student_fee_formated = parseInt(student_fee_string, 10);

    const teacher_payment_string = teacher_payment.replace(/[^0-9]/g, "");
    const teacher_payment_formated = parseInt(teacher_payment_string, 10);

    const all_date = getClassDatesForNextYear(
      selectedDays.map((day) => DAYS_OF_WEEK_NUMBER[day]),
      times
    );
    const lesson = {
      teacher: teacher,
      teacher_payment: teacher_payment_formated,
      students: studentInfo.firstName + " " + studentInfo.lastName,
      student_fee: student_fee_formated,
    };

    const data = all_date.map((time) => ({
      ...lesson,
      start_date: time,
    }));

    // console.log(data);
    const new_lesson = await CreateNewLesson(data);
    AddNewLesson(new_lesson, "admin");
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sameTime"
                checked={sameTimeEachWeek}
                onCheckedChange={(checked) => setSameTimeEachWeek(checked)}
                className="data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-500"
              />
              <Label htmlFor="sameTime">Same time each week</Label>
            </div>

            <div className="space-y-4">
              <Label>Select Days and Times</Label>
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
            <Button onClick={OnCreateNewStudent}>Create Student</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
