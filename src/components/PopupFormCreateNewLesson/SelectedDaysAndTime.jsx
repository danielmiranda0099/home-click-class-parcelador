import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DAYS_OF_WEEK, DAYS_OF_WEEK_NUMBER } from "@/utils/constans";
export function SelectedDaysAndTime({ data_lesson, setDataLesson }) {
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
  };
  return (
    <div className="space-y-4">
      <Label>Select days and times:</Label>
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 ">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className={"flex flex-col items-center"}>
            <Button
              type="button"
              variant={
                data_lesson.selectedDays.includes(day) ? "default" : "outline"
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
  );
}
