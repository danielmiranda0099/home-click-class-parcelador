import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
export function PeriodOfTime({ data_lesson, setDataLesson }) {
  const [type_of_scheduling, setTypeOfScheduling] = useState("period-of-time");
  return (
    <RadioGroup
      defaultValue="period-of-time"
      className="flex flex-col gap-4"
      value={type_of_scheduling}
      onValueChange={(value) => {
        if (value !== "period-of-time") {
          setDataLesson({
            ...data_lesson,
            periodOfTime: "",
            numberOfClasses: { ...data_lesson.numberOfClasses, numbers: "1" },
          });
        }
        if (value !== "number-clases") {
          setDataLesson({
            ...data_lesson,
            numberOfClasses: { ...data_lesson.numberOfClasses, numbers: "0" },
          });
        }
        setTypeOfScheduling(value);
      }}
    >
      <div className="flex gap-2 items-center">
        <RadioGroupItem value="period-of-time" id="opt-1" />
        <Label htmlFor="opt-1">Periodo de tiempo:</Label>
        <RadioGroup
          className="flex flex-col sm:flex-row space-x-4 sm:items-center"
          disabled={type_of_scheduling !== "period-of-time"}
          value={data_lesson.periodOfTime}
          onValueChange={(value) =>
            setDataLesson({ ...data_lesson, periodOfTime: value })
          }
        >
          <div className="flex gap-2">
            <div className="flex items-center">
              <RadioGroupItem value="3M" id="r1" className="sr-only peer" />
              <Label
                htmlFor="r1"
                className={`flex items-center justify-center px-3 py-2 text-sm border rounded-md cursor-pointer 
              ${data_lesson.periodOfTime === "3M" && "bg-blue-400 text-white"}`}
              >
                3 Meses
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="6M" id="r2" className="sr-only peer" />
              <Label
                htmlFor="r2"
                className={`flex items-center justify-center px-3 py-2 text-sm border rounded-md cursor-pointer 
              ${data_lesson.periodOfTime === "6M" && "bg-blue-400 text-white"}`}
              >
                6 Meses
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="1Y" id="r3" className="sr-only peer" />
              <Label
                htmlFor="r3"
                className={`flex items-center justify-center px-3 py-2 text-sm border rounded-md cursor-pointer 
              ${data_lesson.periodOfTime === "1Y" && "bg-blue-400 text-white"}`}
              >
                1 Año
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="flex gap-2 items-center">
        <RadioGroupItem value="number-clases" id="opt-2" />
        <Label htmlFor="opt-2">Numero de clases:</Label>
        <Input
          type="number"
          min={type_of_scheduling === "period-of-time" ? "0" : "1"}
          className="w-20"
          value={data_lesson.numberOfClasses.numbers}
          onChange={(event) =>
            setDataLesson({
              ...data_lesson,
              numberOfClasses: {
                ...data_lesson.numberOfClasses,
                numbers: event.target.value,
              },
            })
          }
          disabled={type_of_scheduling !== "number-clases"}
        />
        <Input
          type="time"
          className={`w-fit border-gray-500 px-1 py-4 transition-opacity ease-in-out delay-150 duration-450
            ${parseInt(data_lesson.numberOfClasses.numbers, 10) === 1 && type_of_scheduling === "number-clases" ? "" : "opacity-0"}`}
          value={data_lesson.numberOfClasses.hour}
          onChange={(e) =>
            setDataLesson({
              ...data_lesson,
              numberOfClasses: {
                ...data_lesson.numberOfClasses,
                hour: e.target.value,
              },
            })
          }
          required={type_of_scheduling === "number-clases" && parseInt(data_lesson.numberOfClasses.numbers, 10) === 1}
        />
      </div>
    </RadioGroup>
  );
}
