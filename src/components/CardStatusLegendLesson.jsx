import { Card, CardContent } from "./ui/card";

export function CardStatusLegendLesson({ rol }) {
  return (
    <Card className="w-[fit-content]">
      <CardContent className="p-4">
        <div className="flex flex-row gap-2 justify-start items-center">
          <div className="bg-blue-300 w-5 h-5 rounded-full"></div>
          <span>Agendada</span>
        </div>

        <div className="flex flex-row gap-2 justify-start items-center">
          <div className="bg-green-300 w-5 h-5 rounded-full"></div>
          <span>
            {rol === "student"
              ? "Finalizada y pagada"
              : rol === "teacher"
                ? "Registrada y pagada"
                : rol === "admin"
                  ? "Pago Realizado Al Profesor - Pago Realizado Por Estudiante"
                  : "UNKNOW"}
          </span>
        </div>

        {rol !== "teacher" && (
          <div className="flex flex-row gap-2 justify-start items-center">
            <div className="bg-yellow-300 w-5 h-5 rounded-full"></div>
            <span>
              {rol === "student"
                ? "Finalizada y en deuda"
                : rol === "admin"
                  ? "Finalizada y pendiente pago del estudiante"
                  : "UNKNOW"}
            </span>
          </div>
        )}

        {rol !== "student" && (
          <div className="flex flex-row gap-2 justify-start items-center">
            <div className="bg-orange-300 w-5 h-5 rounded-full"></div>
            <span>
              {rol === "teacher"
                ? "Registrada y pendiente de pago"
                : rol === "admin"
                  ? "Registrada y pendiente de pago al profesor"
                  : "UNKNOW"}
            </span>
          </div>
        )}

        {rol !== "student" && (
          <div className="flex flex-row gap-2 justify-start items-center">
            <div className="bg-purple-300 w-5 h-5 rounded-full"></div>
            <span>Clase confirmada</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
