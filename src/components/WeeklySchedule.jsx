"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PopupFormWeeklySchedule } from "./popupFormWeeklySchedule";
import { getUserSheduleById } from "@/actions/CrudShedule";
import { useEffect, useState } from "react";
import { DAYS_OF_WEEK_2 } from "@/utils/constans";

const weekDaysDefault = [
  { day: "Lu", hours: ["-"] },
  { day: "Ma", hours: ["-"] },
  { day: "Mi", hours: ["-"] },
  { day: "Ju", hours: ["-"] },
  {
    day: "Vi",
    hours: ["-"],
  },
  { day: "Sa", hours: ["-"] },
  { day: "Do", hours: ["-"] },
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
          hours.map((hour, index) => (
            <Badge
              key={hour + index}
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

export function WeeklySchedule({ userId }) {
  const [user_schedule, setUserSchedule] = useState(weekDaysDefault);
  const [is_open, setIsOpen] = useState(false);

  const formatHour = (isoDate) => {
    const date = new Date(isoDate);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")}${ampm}`;
  };

  const getUserShedule = async () => {
    const { data: user_schedule } = await getUserSheduleById(userId);
    // Encontrar el máximo número de horarios en un día
    const maxHours = Math.max(
      ...user_schedule.map((dayData) => dayData.hours.length)
    );

    // Verificar si hay al menos un día con horarios
    const hasHours = maxHours > 0;

    const formattedWeekDays = hasHours
      ? user_schedule.map((dayData) => {
          const dayName = DAYS_OF_WEEK_2[dayData.day];
          const hours = dayData.hours.map(formatHour);
          // Completar con "-" hasta alcanzar el máximo de horarios
          while (hours.length < maxHours) {
            hours.push("-");
          }
          return {
            day: dayName,
            hours: hours,
          };
        })
      : [];
    setUserSchedule(formattedWeekDays);
  };

  useEffect(() => {
    if (!is_open) {
      getUserShedule();
    }
  }, [is_open]);

  return (
    <Card className="p-2 sm:p-4 w-full max-w-7xl mx-auto overflow-x-hidden flex flex-col gap-3 h-fit">
      <PopupFormWeeklySchedule
        is_open={is_open}
        setIsOpen={setIsOpen}
        userId={userId}
        userSchedule={user_schedule}
      />
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-0">
        {user_schedule.map((day, index) => (
          <DaySchedule
            key={day.day}
            day={day.day}
            hours={day.hours}
            isLast={index === user_schedule.length - 1}
          />
        ))}
      </div>
    </Card>
  );
}
