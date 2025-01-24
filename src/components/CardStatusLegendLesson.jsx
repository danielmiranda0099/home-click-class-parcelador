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
        <PopoverContent className="w-[fit-content] max-w-full p-0 border-0 ">
          <ContentCardStatusLegendLesson rol={rol} />
        </PopoverContent>
      </Popover>
    );
  }
  return <ContentCardStatusLegendLesson rol={rol} />;
}

function ContentCardStatusLegendLesson({ rol }) {
  return (
    <Card className="max-w-full sm:max-w-xl">
      <CardContent className="flex flex-col gap-1 p-4 max-w-full sm:max-w-full ">
        <div className="flex flex-row gap-2 justify-start items-center">
          <div className="bg-blue-300 w-5 h-5 rounded-full"></div>
          <span className="text-sm sm:text-base">Agendada</span>
        </div>

        {rol !== "student" && (
          <div className="flex flex-row gap-2 justify-start items-center">
            <div className="bg-purple-300 w-5 h-5 rounded-full"></div>
            <span className="text-sm sm:text-base">Clase confirmada</span>
          </div>
        )}

        {rol !== "teacher" && (
          <div className="flex flex-row gap-2 justify-start items-center">
            <div className="bg-yellow-300 w-5 h-5 rounded-full"></div>
            <span className="text-sm sm:text-base">
              {rol === "student"
                ? "Finalizada y en deuda"
                : rol === "admin"
                  ? "Finalizada, pendiente pago del estudiante"
                  : "UNKNOW"}
            </span>
          </div>
        )}

        {rol !== "student" && (
          <div className="flex flex-row gap-2 justify-start items-center">
            <div className="bg-orange-300 w-5 h-5 rounded-full"></div>
            <span className="text-sm sm:text-base">
              {rol === "teacher"
                ? "Registrada y pendiente de pago"
                : rol === "admin"
                  ? "Registrada, pendiente pago al profesor/estudiante"
                  : "UNKNOW"}
            </span>
          </div>
        )}

        <div className="flex flex-row gap-2 justify-start items-center">
          <div className="bg-green-300 w-5 h-5 rounded-full"></div>
          <span className="text-sm sm:text-base">
            {rol === "student"
              ? "Finalizada y pagada"
              : rol === "teacher"
                ? "Registrada y pagada"
                : rol === "admin"
                  ? "Pagos hechos, clase finalizada"
                  : "UNKNOW"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
