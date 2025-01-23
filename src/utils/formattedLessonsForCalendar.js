"use server";
import { auth } from "@/auth";
import { statusLesson } from "./formatStatusLesson";
import { FormattedDate } from "./formattedDate";
import { formatNamesForCalendar } from "./getNamesForLesson";

export async function formattedLessonsForCalendar(original_lesson) {
  const { user } = await auth();
  const rol = user?.role[0];
  if (!original_lesson || original_lesson.length <= 0) {
    return [];
  }
  return await Promise.all(
    original_lesson.map(async (lesson) => {
      const [background, color, lesson_status] = await statusLesson(
        lesson,
        rol
      );
      return {
        id: lesson.id,
        title:
          formatNamesForCalendar(
            lesson?.studentLessons?.map(
              (student_lesson) => student_lesson.student.shortName
            )
          ) || "UNKNOW",
        start: new Date(FormattedDate(lesson.startDate)),
        end: new Date(FormattedDate(lesson.startDate, true)),
        background,
        color,
        lesson_status,
        ...lesson,
      };
    })
  );
}
