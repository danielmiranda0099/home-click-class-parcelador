"use client";

import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { useLessonsStore } from "@/store/lessonStore";
import { useEffect, useMemo, useState } from "react";
import { useUiStore } from "@/store/uiStores";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { isCurrentDateGreater } from "@/utils/isCurrentDateGreater";
import { FormattedDate } from "@/utils/formattedDate";
import { getMonth, getYear } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { navigateMonth } from "@/utils/navigateMonth";

const localizer = momentLocalizer(moment);

export function CalendarUI({ rol }) {
  const {
    lessons,
    setLessons,
    isLoadingLessons,
    setSelectedLesson,
    lessons_filtered,
  } = useLessonsStore();
  const setPopupDetailLesson = useUiStore(
    (state) => state.setPopupDetailLesson
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  const getDateRangeFromUrl = () => {
    return {
      startOfMonth: new Date(
        parseInt(searchParams.get("year")),
        parseInt(searchParams.get("month")) - 1,
        1
      ),
      endOfMonth: new Date(
        parseInt(searchParams.get("year")),
        parseInt(searchParams.get("month")),
        0
      ),
    };
  };

  const [date, setDate] = useState(new Date());

  // Solo hacer la llamada a la API si no hay lecciones cargadas
  //TODO esto no tiene sentido o mejor se pasa al page
  useEffect(() => {
    // Verifica si ya están configurados
    if (!searchParams.get("year") || !searchParams.get("year")) {
      const currentMonth = getMonth(new Date()) + 1;
      const currentYear = getYear(new Date());

      router.push(`?month=${currentMonth}&year=${currentYear}`);
    }
  }, [lessons, setLessons]);

  useEffect(() => {
    if (searchParams.get("month") && searchParams.get("year")) {
      setLessons(getDateRangeFromUrl());

      setDate(
        new Date(
          parseInt(searchParams.get("year")),
          parseInt(searchParams.get("month")) - 1,
          1
        )
      );
    }
  }, [searchParams]);

  const [view, setView] = useState(Views.MONTH);

  const handleOnChangeView = (selectedView) => {
    setView(selectedView);
  };

  const onNavigate = (newDate, view, action) => {
    if (!isLoadingLessons && action !== "TODAY") {
      const date = navigateMonth(
        parseInt(searchParams.get("month")) - 1,
        parseInt(searchParams.get("year")),
        action
      );
      router.push(`?month=${date.month + 1}&year=${date.year}`);
      return setDate(newDate);
    }
    if (action === "TODAY") {
      const currentMonth = getMonth(new Date()) + 1;
      const currentYear = getYear(new Date());

      router.push(`?month=${currentMonth}&year=${currentYear}`);
      return setDate(newDate);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedLesson(event);
    setPopupDetailLesson(true);
  };

  // Memorizar las lecciones formateadas para evitar recalcularlas en cada render
  const memoizedLessons = useMemo(() => lessons_filtered, [lessons_filtered]);

  return (
    <section className="px-0 py-0 sm:px-2 sm:py-3 max-w-full overflow-x-auto mb-4">
      <Calendar
        localizer={localizer}
        events={memoizedLessons}
        startAccessor="start"
        endAccessor="end"
        view={view}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        popup
        style={{ height: "135vh" }}
        className="w-[900px] sm:w-[1200px] lg:w-full"
        showMultiDayTimes
        defaultView={Views.MONTH}
        date={date}
        onNavigate={onNavigate}
        onView={handleOnChangeView}
        selectable
        onSelectEvent={handleSelectEvent}
        eventPropGetter={(event) => {
          return {
            style: {
              backgroundColor: event.background || "#adb5bd",
              color: event.color || "white",
            },
            className:
              ((rol === "student" && !event.isConfirmed) ||
                (rol === "teacher" &&
                  event.isConfirmed &&
                  !event.isRegistered)) &&
              isCurrentDateGreater(FormattedDate(event.startDate)) &&
              `has-ping`,
          };
        }}
      />
    </section>
  );
}
