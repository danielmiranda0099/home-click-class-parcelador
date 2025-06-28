import { formatCurrency } from "@/utils/formatCurrency";
import { useMemo } from "react";


function calculateLessonBalance(lessons) {
  return lessons.reduce(
    (acc, lesson) => {
      const { isRegistered, isTeacherPaid, teacherPayment, studentLessons } =
        lesson;

      if (isRegistered) {
        if (isTeacherPaid) {
          acc.totalExpenses += teacherPayment;
        } else {
          acc.pendingTeacherPayments += teacherPayment;
        }
      }

      for (const { isStudentPaid, isConfirmed, studentFee } of studentLessons) {
        if (isStudentPaid) {
          acc.totalIncome += studentFee;
        } else if (isConfirmed) {
          acc.pendingStudentPayments += studentFee;
        }
      }

      return acc;
    },
    {
      totalIncome: 0,
      totalExpenses: 0,
      pendingStudentPayments: 0,
      pendingTeacherPayments: 0,
    }
  );
}

export function CalendarBalance({ lessons }) {
  const {
    totalIncome,
    totalExpenses,
    pendingStudentPayments,
    pendingTeacherPayments,
  } = useMemo(() => calculateLessonBalance(lessons), [lessons]);

  return (
    <section className="w-fit mt-4 flex flex-col sm:flex-row items-center gap-10 mx-auto">
      <div className="flex flex-col items-center">
        <p className="font-semibold">Total ingresos:</p>
        <p className="text-green-400">{formatCurrency(totalIncome)}</p>
      </div>

      <div className="flex flex-col items-center">
        <p className="font-semibold">Total egresos:</p>
        <p className="text-red-400">{formatCurrency(totalExpenses)}</p>
      </div>

      <div className="flex flex-col items-center">
        <p className="font-semibold">P.P Estudiantes:</p>
        <p className="text-green-400">{formatCurrency(pendingStudentPayments)}</p>
      </div>

      <div className="flex flex-col items-center">
        <p className="font-semibold">P.P Profesores:</p>
        <p className="text-red-400">{formatCurrency(pendingTeacherPayments)}</p>
      </div>
    </section>
  );
}
