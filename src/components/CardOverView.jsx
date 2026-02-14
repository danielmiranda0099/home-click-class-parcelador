"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BookOpenIcon,
  CalendarIcon,
  DollarSignIcon,
  RatingIcon,
} from "@/components/icons";
import {
  overViewLessonStudent,
  overViewLessonTeacher,
} from "@/actions/CrudLesson";
import { formatCurrency } from "@/utils/formatCurrency";
import { useEffect, useState } from "react";
import { useUserSession } from "@/hooks";
import { useLessonsStore } from "@/store/lessonStore";

export function CardOverView({ role, id }) {
  const [data, setData] = useState({
    averageScore: 0,
    completed: 0,
    scheduled: 0,
    debt: 0,
    averageScoreReal: 0,
    totalPaid: 0,
  });

  const { lessons } = useLessonsStore();

  const user_session = useUserSession();

  const onOverViewLessonTeacher = async () => {
    const response = await overViewLessonTeacher(id);
    if (response.success) {
      setData(response.data);
    }
  };

  const onOverViewLessonStudent = async () => {
    const response = await overViewLessonStudent(id);
    if (response.success) {
      setData(response.data);
    }
  };

  useEffect(() => {
    if (role === "teacher") {
      onOverViewLessonTeacher();
    }
    if (role === "student") {
      onOverViewLessonStudent();
    }
  }, [lessons]);

  return (
    <Card className="min-w-fit max-w-full">
      <CardHeader>
        <CardTitle className="text-xl sm:text-xl">
          Estado de cuenta y horarios
        </CardTitle>
      </CardHeader>
      <CardContent
        className={`grid gap-2 sm:gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 ${user_session?.user.role.includes("admin") ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}
      >
        {role === "teacher" && (
          <div className="flex items-center gap-2">
            <RatingIcon size="1rem" className="text-muted-foreground" />
            <span className="text-md font-medium text-muted-foreground">
              Puntaje:
            </span>
            <div className="flex items-center">
              {user_session?.user.role.includes("admin") && (
                <>
                  <h2 className="text-md font-bold">
                    {data?.averageScoreReal.toFixed(2)}
                    <span className="text-xs">Real</span>
                  </h2>
                  <h2 className="text-md font-bold">/</h2>
                </>
              )}
              <h2 className="text-md font-bold">{data?.averageScore}</h2>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <BookOpenIcon size="1rem" className="text-muted-foreground" />
          <span className="text-md font-medium text-muted-foreground">
            Completadas:
          </span>
          <h2 className="text-md font-bold">{data?.completed}</h2>
        </div>

        <div className="flex items-center gap-2">
          <CalendarIcon size="1rem" className="text-muted-foreground" />
          <span className="text-md font-medium text-muted-foreground">
            Agendadas:
          </span>
          <h2 className="text-md font-bold">{data?.scheduled}</h2>
        </div>

        <div className="flex items-center gap-2">
          <DollarSignIcon size="1rem" className="text-muted-foreground" />
          <span className="text-md font-medium text-muted-foreground">
            {role === "teacher" ? "Cobro:" : "Deuda:"}
          </span>
          <h2 className="text-md font-bold text-red-600">
            {formatCurrency(data?.debt.toString())}
          </h2>
        </div>

        {user_session?.user.role.includes("admin") && (
          <div className="flex items-center gap-2">
            <DollarSignIcon size="1rem" className="text-muted-foreground" />
            <span className="text-md font-medium text-muted-foreground">
              Pagado:
            </span>
            <h2 className="text-md font-bold">
              {formatCurrency(data?.totalPaid.toString())}
            </h2>
          </div>
        )}

        {(role === "student" || user_session?.user.role.includes("admin")) && (
          <div className="flex items-center gap-2">
            <DollarSignIcon size="1rem" className="text-muted-foreground" />
            <span className="text-md font-medium text-muted-foreground">
              Abono:
            </span>
            <h2
              className={`text-md font-bold leading-tight ${data?.prepaid > 0 ? "text-green-600" : ""}`}
            >
              <span className="block">{data?.prepaid} clases</span>
              {data?.prepaid > 0 && (
                <span className="block text-sm font-bold">
                  ({formatCurrency(data?.prepaidAmount.toString())})
                </span>
              )}
            </h2>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
