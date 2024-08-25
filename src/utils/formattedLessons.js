import { FormattedDate } from "./formattedDate";

const statusLesson = (lesson) => {
  if (lesson.is_canceled) {
    return "red";
  }
  if (lesson?.is_scheduled && lesson?.is_approved && lesson?.is_paid) {
    return "green";
  }
  if(lesson?.is_scheduled && lesson?.is_approved){
    return "purple";
  }
  if(lesson?.is_scheduled){
    return "blue"
  }
  return "yellow"
};

export function FormattedLessons(original_lesson) {
  if (original_lesson.length <= 0) {
    return [];
  }
  return original_lesson.map((lesson) => ({
    id: lesson.id,
    title: lesson.topic,
    start: FormattedDate(lesson.start_date),
    end: FormattedDate(lesson.end_date),
    color: statusLesson(lesson),
    ...lesson,
  }));
}
