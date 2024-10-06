"use client";

import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { GetLessons } from "@/actions/CrudLesson";
import { useLessonStore } from "@/store/lessonStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";
import { useUiStore } from "@/store/uiStores";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export function CalendarUI({ rol }) {
  const lessons = useLessonStore((state) => state.lessons);
  const SetLessons = useLessonStore((state) => state.SetLessons);
  const setSelectedLesson = useLessonStore((state) => state.setSelectedLesson);
  const setPopupDetailLesson = useUiStore(
    (state) => state.setPopupDetailLesson
  );

  // Solo hacer la llamada a la API si no hay lecciones cargadas
  //TODO esto no tiene sentido o mejor se pasa al page
  useEffect(() => {
    if (!lessons || lessons.length === 0) {
      GetLessons()
        .then((data) => {
          const formattedLessons = FormattedLessonsForCalendar(data, rol);
          SetLessons(formattedLessons);
          console.log(formattedLessons);
        })
        .catch((error) => {
          console.error("Error fetching lessons:", error);
        });
    }
  }, [lessons, SetLessons, rol]);

  const [view, setView] = useState(Views.MONTH);

  const handleOnChangeView = (selectedView) => {
    setView(selectedView);
  };

  const [date, setDate] = useState(new Date());
  const onNavigate = useCallback(
    (newDate) => {
      return setDate(newDate);
    },
    [setDate]
  );

  const handleSelectEvent = (event) => {
    setSelectedLesson(event);
    setPopupDetailLesson(true);
  };

  // Memorizar las lecciones formateadas para evitar recalcularlas en cada render
  const memoizedLessons = useMemo(() => lessons, [lessons]);

  return (
    <>
      <Calendar
        localizer={localizer}
        events={memoizedLessons}
        startAccessor="start"
        endAccessor="end"
        view={view}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        popup
        style={{ height: "100vh" }}
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
          };
        }}
      />
    </>
  );
}
