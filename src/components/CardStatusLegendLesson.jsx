import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { HelpIcon } from "@/components/icons";

//TODO: Que esto no dependa del rol, tener ya estaticamente.
export function CardStatusLegendLesson({ rol }) {
  if (rol === "admin") {
    return (
      <Popover>
        <PopoverTrigger className="absolute shadow-slate-600 p-0 shadow-md rounded-full hover:bg-gray-200">
          <HelpIcon size={"3rem"} />
        </PopoverTrigger>
        <PopoverContent className="w-[fit-content] p-0 border-0">
          <ContentCardStatusLegendLesson rol={rol} />
        </PopoverContent>
      </Popover>
    );
  }
  return <ContentCardStatusLegendLesson rol={rol} />;
}

function ContentCardStatusLegendLesson({ rol }) {
  return (
    <Card className="max-w-xl">
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
