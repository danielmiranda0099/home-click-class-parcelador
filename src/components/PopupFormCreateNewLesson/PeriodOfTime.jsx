import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
export function PeriodOfTime({ data_lesson, setDataLesson }) {
  return (
    <RadioGroup
      className="flex space-x-4 items-center"
      value={data_lesson.periodOfTime}
      onValueChange={(value) =>
        setDataLesson({ ...data_lesson, periodOfTime: value })
      }
    >
      <Label>Periodo de tiempo:</Label>
      <div className="flex items-center">
        <RadioGroupItem value="3M" id="r1" className="sr-only" />
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
    </RadioGroup>
  );
}
