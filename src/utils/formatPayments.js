import moment from "moment";

export function formatPayments(lessons, user) {
  if (!lessons || lessons?.length <= 0 || !user) return null;
  return lessons.map((lesson) => {
    let studentLesson = null;
    if (user.role.includes("student")) {
      studentLesson = lesson.studentLessons.find(
        (sl) => sl.student.id === user.id
      );
    }
    return {
      isPay: lesson.isPay !== undefined ? lesson.isPay : true,
      name: user.firstName,
      date: moment(lesson.startDate).format("D/M/YYYY"),
      price: user.role.includes("teacher")
        ? lesson.teacherPayment
        : studentLesson
          ? studentLesson.studentFee
          : null,
      ...lesson,
    };
  });
}
