import moment from "moment";

export function formatLessonsToDelete(lessons) {
  if (!lessons || lessons?.length <= 0) return null;

  return lessons.map((lesson) => {
    return {
      isToDelete: lesson.isToDelete !== undefined ? lesson.isToDelete : true,
      type: lesson.isGroup ? "Grupal" : "Individual",
      date: moment(lesson.startDate).format("D/M/YYYY"),
      ...lesson,
    };
  });
}
