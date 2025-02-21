import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PopupFormWeeklySchedule } from "./popupFormWeeklySchedule";


const weekDays = [
  { day: "Lu", hours: ["10:00am", "7:00pm","-",] },
  { day: "Ma", hours: ["-","-","-",] },
  { day: "Mi", hours: ["7:00am","-","-",] },
  { day: "Ju", hours: ["2:00pm","-","-",] },
  {
    day: "Vi",
    hours: ["8:00am", "10:00am", "11:00am"],
  },
  { day: "Sa", hours: ["-","-","-",] },
  { day: "Do", hours: ["-","-","-",] },
];

function DaySchedule({ day, hours, isLast }) {
  return (
    <div
      className={`flex sm:flex-col items-center justify-between sm:justify-start
                    ${!isLast ? "sm:border-r" : ""} 
                    py-2 px-3 sm:px-1 border-b sm:border-b-0 last:border-b-0`}
    >
      <h3 className="font-semibold text-sm sm:mb-2 mr-3 sm:mr-0 bg-primary rounded-full text-white px-[0.7rem] py-[0.6rem]">
        {day}
      </h3>
      <div className="flex flex-row sm:flex-col items-end sm:items-center space-x-1 sm:space-x-0 sm:space-y-1 flex-wrap gap-2 justify-end">
        {hours.length > 0 ? (
          hours.map((hour,index) => (
            <Badge
              key={hour+index}
              variant="secondary"
              className="text-xs px-1 py-0.5 sm:px-2 sm:py-1"
            >
              {hour}
            </Badge>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </div>
    </div>
  );
}

export function WeeklySchedule({userId}) {
  return (
    <Card className="p-2 sm:p-4 w-full max-w-7xl mx-auto overflow-x-hidden flex flex-col gap-3 h-fit">
      <PopupFormWeeklySchedule userId={userId} />
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-0">
        {weekDays.map((day, index) => (
          <DaySchedule
            key={day.day}
            day={day.day}
            hours={day.hours}
            isLast={index === weekDays.length - 1}
          />
        ))}
      </div>
    </Card>
  );
}
