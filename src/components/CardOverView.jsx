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

export async function CardOverView({ role, id }) {
  let data = {
    averageScore: 0,
    completed: 0,
    scheduled: 0,
    debt: 0,
  };
  if (role === "teacher") {
    const response = await overViewLessonTeacher(id);
    if (response.success) {
      data = response.data;
    }
  }
  if (role === "student") {
    const response = await overViewLessonStudent(id);
    if (response.success) {
      data = response.data;
    }
  }

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

            <h2 className="text-lg font-bold">{data.averageScore}</h2>
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

          <h2 className="text-lg font-bold">{data.completed}</h2>
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

          <h2 className="text-lg font-bold">{data.scheduled}</h2>
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
            {formatCurrency(data.debt.toString())}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
}
