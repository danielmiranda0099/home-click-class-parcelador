import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

function calculateLessonBalance(lessons) {
  return lessons.reduce(
    (acc, lesson) => {
      const {
        isRegistered,
        isTeacherPaid,
        teacherPayment,
        studentLessons,
        isScheduled,
        isCanceled,
        isConfirmed,
      } = lesson;

      if (isRegistered) {
        if (isTeacherPaid) {
          acc.totalExpenses += teacherPayment ?? 0;
        } else {
          acc.pendingTeacherPayments += teacherPayment ?? 0;
        }
      }

      for (const studentLesson of studentLessons) {
        const {
          isStudentPaid,
          isConfirmed: isStudentConfirmed,
          studentFee,
        } = studentLesson;

        if (isStudentPaid) {
          acc.totalIncome += studentFee ?? 0;
        } else if (isStudentConfirmed) {
          acc.pendingStudentPayments += studentFee ?? 0;
        }

        if (
          isScheduled &&
          !isConfirmed &&
          !isCanceled &&
          !isStudentPaid &&
          studentFee
        ) {
          acc.totalScheduledPayments += studentFee;
        }
      }

      return acc;
    },
    {
      totalIncome: 0,
      totalExpenses: 0,
      pendingStudentPayments: 0,
      pendingTeacherPayments: 0,
      totalScheduledPayments: 0,
    }
  );
}

function filterLessonsByMonth(lessons, year, month) {
  return lessons.filter((lesson) => {
    const date = new Date(lesson.startDate);
    return date.getFullYear() === year && date.getMonth() === month - 1;
  });
}

export function CalendarBalance({ lessons }) {
  const searchParams = useSearchParams();
  const month = parseInt(searchParams.get("month"));
  const year = parseInt(searchParams.get("year"));

  const filteredLessons = useMemo(() => {
    if (!month || !year) return [];
    return filterLessonsByMonth(lessons, year, month);
  }, [lessons, month, year]);

  const {
    totalIncome,
    totalExpenses,
    pendingStudentPayments,
    pendingTeacherPayments,
    totalScheduledPayments,
  } = useMemo(() => calculateLessonBalance(filteredLessons), [filteredLessons]);

  return (
    <section className="w-fit mt-4 flex flex-col sm:flex-row items-center gap-10 mx-auto">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center">
              <p>Balance:</p>
              <p
                className={`${
                  totalIncome - totalExpenses >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {formatCurrency(totalIncome - totalExpenses)}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Balance de cada mes.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center">
              <p>T.P Estudiantes:</p>
              <p className="text-green-400">{formatCurrency(totalIncome)}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total pagos de los estudiantes.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center">
              <p>T.P Profesores:</p>
              <p className="text-red-400">{formatCurrency(totalExpenses)}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total de pagos hechos a los profesores.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <span className="w-5 h-5 rounded-full mr-2 border-gray-500 border-2 bg-yellow-200" />
                P.P Estudiantes
              </div>
              <p className="text-yellow-500">
                {formatCurrency(pendingStudentPayments)}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total de pagos pendientes de los estudiantes.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <span className="w-5 h-5 rounded-full mr-2 border-gray-500 border-2 bg-orange-400" />
                P.P Profesores
              </div>
              <p className="text-orange-500">
                {formatCurrency(pendingTeacherPayments)}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total de pagos pendientes a los profesores.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <span className="w-5 h-5 rounded-full mr-2 border-gray-500 border-2 bg-[#7dd3fc]" />
                Total Agendadas
              </div>
              <p className="text-blue-700">
                {formatCurrency(totalScheduledPayments)}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total acumulado de clases agendadas.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </section>
  );
}
