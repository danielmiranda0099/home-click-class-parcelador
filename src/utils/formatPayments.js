import moment from "moment";

export function formatPayments(lessons, user) {
  if (!lessons || lessons?.length <= 0 || !user) return null;
  console.log("user", user);
  return lessons.map((lesson) => ({
    name: user.firstName,
    date: moment(lesson.startDate).format("D/M/YYYY"),
    price: user.role === "teacher" ? lesson.teacherPayment : lesson.studentFee,
  }));
}
