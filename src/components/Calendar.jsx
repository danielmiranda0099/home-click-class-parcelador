"use client";

import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { useLessonsStore } from "@/store/lessonStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useUiStore } from "@/store/uiStores";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export function CalendarUI({ rol }) {
  const { lessons, setLessons, setSelectedLesson, lessons_filtered } =
    useLessonsStore();
  const setPopupDetailLesson = useUiStore(
    (state) => state.setPopupDetailLesson
  );
  const [counter_DB, setCounterDB] = useState(0);

  // Solo hacer la llamada a la API si no hay lecciones cargadas
  //TODO esto no tiene sentido o mejor se pasa al page
  useEffect(() => {
    setCounterDB(counter_DB + 1);
    if ((lessons || lessons.length === 0) && counter_DB <= 15) {
      setCounterDB(16);
      setLessons(rol, true);
    }
  }, [lessons, setLessons, rol]);

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
  const memoizedLessons = useMemo(() => lessons_filtered, [lessons_filtered]);

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
