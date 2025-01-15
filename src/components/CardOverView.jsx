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

export function CardOverView({ role, id }) {
  const [data, setData] = useState({
    averageScore: 0,
    completed: 0,
    scheduled: 0,
    debt: 0,
    averageScoreReal: 0,
  });

  const user_session = useUserSession();

  console.log("user_session", user_session);

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
  }, []);

  return (
    <Card className="w-[fit-content]">
      <CardHeader>
        <CardTitle>Estado de cuenta y horarios</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-10 grid-flow-col auto-cols-max">
        {role === "teacher" && (
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center justify-start gap-2">
              <RatingIcon size="1.5rem" className="text-muted-foreground" />
              <div className="flex flex-col items-start justify-center">
                <span className="text-xl font-medium text-muted-foreground block">
                  Puntage:
                </span>
              </div>
            </div>
            {user_session?.user.role.includes("admin") && (
              <>
                <h2 className="text-lg font-bold">
                  {data?.averageScoreReal.toFixed(2)}
                  <span className="text-xs">Real</span>
                </h2>
                <h2 className="text-lg font-bold">/</h2>
              </>
            )}
            <h2 className="text-lg font-bold">{data?.averageScore}</h2>
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-start gap-2">
            <BookOpenIcon size="1.5rem" className="text-muted-foreground" />
            <div className="flex flex-col items-start justify-center">
              <span className="text-xl font-medium text-muted-foreground block">
                Completadas:
              </span>
            </div>
          </div>

          <h2 className="text-lg font-bold">{data?.completed}</h2>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-start gap-2">
            <CalendarIcon size="1.5rem" className="text-muted-foreground" />
            <div className="flex flex-col items-start justify-center">
              <span className="text-xl font-medium text-muted-foreground block">
                Agendadas:
              </span>
            </div>
          </div>

          <h2 className="text-lg font-bold">{data?.scheduled}</h2>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-start gap-2">
            <DollarSignIcon size="1.5rem" className="text-muted-foreground" />
            <div className="flex flex-col items-start justify-center">
              <span className="text-xl font-medium text-muted-foreground block">
                {role === "teacher" && "Cobro:"}
                {role === "student" && "Deuda:"}
              </span>
            </div>
          </div>

          <h2 className="text-lg font-bold text-red-600">
            {formatCurrency(data?.debt.toString())}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
}
