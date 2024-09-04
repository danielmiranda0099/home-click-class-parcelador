"use client";

import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { GetLessons } from "@/actions/CrudLesson";
import { useLessonStore } from "@/store/lessonStore";

import { useCallback, useEffect, useState } from "react";
import { FormattedLessons } from "@/utils/formattedLessons";

import { useUiStore } from "@/store/uiStores";
import { PopupDetailLesson } from ".";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export function CalendarUI({ rol }) {
  const lessons = useLessonStore((state) => state.lessons);
  const SetLessons = useLessonStore((state) => state.SetLessons);
  const setSelectedLesson = useLessonStore((state) => state.setSelectedLesson);
  const setPopupDetailLesson = useUiStore(
    (state) => state.setPopupDetailLesson
  );

  //TODO esto no tiene sentido
  useEffect(() => {
    GetLessons()
      .then((data) => {
        const lessons = FormattedLessons(data, rol);
        console.log("lessons", lessons);
        SetLessons(lessons);
        console.log(lessons);
      })
      .catch((error) => {
        console.error("Error fetching lessons:", error);
      });
  }, []);

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
    console.log("Click", event);
    setPopupDetailLesson(true);
  };

  return (
    <>
      <PopupDetailLesson rol={rol} />
      <Calendar
        localizer={localizer}
        events={lessons}
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
