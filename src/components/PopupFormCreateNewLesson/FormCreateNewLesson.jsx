"use client";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useLessonsStore } from "@/store/lessonStore";
import { useUiStore } from "@/store/uiStores";

import { DATA_LESSON_DEFAULT } from "@/utils/constans";

import { scheduleLessonsByPeriod } from "@/utils/scheduleLessonsByPeriod";
import { scheduleLessonsByCount } from "@/utils/scheduleLessonsByCount";
import { createNewLesson, validateLessonData } from "@/actions/CrudLesson";
import { PeriodOfTime } from "./PeriodOfTime";
import { SelectedDaysAndTime } from "./SelectedDaysAndTime";
import { FormFieldStudents } from "./FormFieldStudents";
import { FormFieldTeacher } from "./FormFieldTeacher";
import { ErrorAlert } from "@/components";
import { useCustomToast } from "@/hooks";
import { useSearchParams } from "next/navigation";
import {
  getUserScheduleById,
  updateSchedule,
  validateScheduleData,
} from "@/actions/CrudShedule";
import { PopupCreateNewLessonsAlert } from "./PopupCreateNewLessonsAlert";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "scheduling classes.." : "schedule classes"}
    </Button>
  );
}

export function FormCreateNewLesson() {
  const { setLessons } = useLessonsStore();
  const { setPopupFormCreateNewLesson: setIsOpen } = useUiStore();
  const [is_open_popup_alert, setIsOpenPopupAlert] = useState(false);
  const [data_lesson, setDataLesson] = useState(DATA_LESSON_DEFAULT);
  const [form_state, dispath] = useFormState(createNewLesson, {
    data: [],
    succes: null,
    error: false,
    message: null,
  });
  const [form_state_validate_lesson_data, dispathValidateLessonData] =
    useFormState(validateLessonData, {
      data: [],
      succes: null,
      error: false,
      message: null,
    });
  const [form_state_validate_schedule_data, dispathValidateScheduleData] =
    useFormState(validateScheduleData, {
      data: [],
      succes: null,
      error: false,
      message: null,
    });
  const [form_state_schedule, dispathSchedule] = useFormState(updateSchedule, {
    data: [],
    succes: null,
    error: false,
    message: null,
  });
  const [error_message, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const { toastSuccess } = useCustomToast();

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

  const getUserSchedule = async (id) => {
    const response = await getUserScheduleById(id);
    if (response.success) {
      return response.data;
    } else {
      setErrorMessage(response.message);
      return null;
    }
  };
  const mergeSchedules = (current_schedule, new_schedule) => {
    const scheduleMap = new Map(
      current_schedule.map((item) => [item.day, item])
    );
    new_schedule.scheduleData.forEach(({ day, hours }) => {
      if (scheduleMap.has(day)) {
        scheduleMap.get(day).hours.push(...hours);
      } else {
        scheduleMap.set(day, { day, hours: [...hours] });
      }
    });
    // Convertir el mapa de vuelta a array
    return Array.from(scheduleMap.values());
  };

  const OnCreateNewLessons = async () => {
    setErrorMessage("");
    let all_dates;
    if (
      data_lesson.periodOfTime !== "" &&
      (data_lesson.numberOfClasses.numbers === "0" || !data_lesson.numberOfClasses.numbers)
    ) {
      all_dates = scheduleLessonsByPeriod(
        data_lesson.selectedDays,
        data_lesson.times,
        data_lesson.periodOfTime,
        data_lesson.startDate,
      );
    }
    if (
      data_lesson.periodOfTime === "" &&
      (data_lesson.numberOfClasses.numbers !== "0" || data_lesson.numberOfClasses.numbers)
    ) {
      all_dates = scheduleLessonsByCount(
        data_lesson.selectedDays,
        data_lesson.times,
        data_lesson.startDate,
        data_lesson.numberOfClasses
      );
    }
    
    data_lesson.allDates = all_dates.data;
    dispathValidateLessonData(data_lesson);
  };

  useEffect(() => {
    if (form_state_validate_lesson_data?.success) {
      const fetchAndMergeSchedules = async () => {
        const { times } = form_state_validate_lesson_data.data;
        const new_schedule = Object.entries(times).map(([day, time]) => ({
          day: parseInt(day),
          hours: [new Date(`1996-01-01T${time}:00`).toISOString()],
        }));

        const new_schedule_users = [
          {
            userId: data_lesson.teacher.teacher.id,
            scheduleData: new_schedule,
          },
          ...data_lesson.students.map((student) => ({
            userId: student.student.id,
            scheduleData: new_schedule,
          })),
        ];

        const new_schedule_users_formated = await Promise.all(
          new_schedule_users.map(async (schedule_user) => {
            const current_schedule_user = await getUserSchedule(
              schedule_user.userId
            );

            const current_schedule_user_formated = current_schedule_user.map(
              (current_schedule) => ({
                day: current_schedule.day,
                hours: current_schedule.hours.map((hour) => hour.toISOString()),
              })
            );
            return {
              userId: schedule_user.userId,
              scheduleData: mergeSchedules(
                current_schedule_user_formated,
                schedule_user
              ),
            };
          })
        );
        dispathValidateScheduleData(new_schedule_users_formated);
      };

      fetchAndMergeSchedules();
    }
    if (form_state_validate_lesson_data?.error) {
      setErrorMessage(form_state_validate_lesson_data.message);
    } else {
      setErrorMessage("");
    }
  }, [form_state_validate_lesson_data]);

  useEffect(() => {
    if (form_state_validate_schedule_data?.success) {
      const { isValid } = form_state_validate_schedule_data.data;
      if (isValid) {
        dispathSchedule(form_state_validate_schedule_data.data.data);
      } else {
        setIsOpenPopupAlert(true);
      }
    }
    if (form_state_validate_schedule_data?.error) {
      setErrorMessage(form_state_validate_schedule_data.message);
    } else {
      setErrorMessage("");
    }
  }, [form_state_validate_schedule_data]);

  useEffect(() => {
    if (form_state_schedule?.success) {
      dispath(form_state_validate_lesson_data.data);
    }
    if (form_state_schedule?.error) {
      setErrorMessage(form_state_schedule.message);
    } else {
      setErrorMessage("");
    }
  }, [form_state_schedule]);

  useEffect(() => {
    if (form_state?.success) {
      toastSuccess({ title: "Clases creadas." });
      setLessons(getDateRangeFromUrl(), true);
      setIsOpen(false);
    }
    if (form_state?.error) {
      setErrorMessage(form_state.message);
    } else {
      setErrorMessage("");
    }
  }, [form_state]);

  return (
    <form className="px-0" action={OnCreateNewLessons}>
      <PopupCreateNewLessonsAlert
        is_open_popup_alert={is_open_popup_alert}
        setIsOpenPopupAlert={setIsOpenPopupAlert}
        handleAction={() =>
          dispathSchedule(form_state_validate_schedule_data.data.data)
        }
        message={form_state_validate_schedule_data.data.message}
      />
      <div className="space-y-4">
        <FormFieldStudents
          data_lesson={data_lesson}
          setDataLesson={setDataLesson}
        />

        <FormFieldTeacher
          data_lesson={data_lesson}
          setDataLesson={setDataLesson}
        />

        <PeriodOfTime data_lesson={data_lesson} setDataLesson={setDataLesson} />

        <div className="flex space-x-4 items-center">
          <Label htmlFor="start_date">Fecha de inicio:</Label>
          <Input
            type="date"
            id="start_date"
            value={data_lesson.startDate}
            onChange={(event) =>
              setDataLesson({
                ...data_lesson,
                startDate: event.target.value,
              })
            }
            className="w-[fit-content]"
          />
        </div>

        <SelectedDaysAndTime
          data_lesson={data_lesson}
          setDataLesson={setDataLesson}
        />
      </div>

      <ErrorAlert message={error_message} />

      <DialogFooter>
        <div className="mt-6 space-x-4 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <SubmitButton />
        </div>
      </DialogFooter>
    </form>
  );
}
