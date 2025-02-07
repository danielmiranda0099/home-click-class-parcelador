"use client";
import { format, parseISO, getDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UsersIcon } from "@/components/icons";

function formatDaysOfWeek(lessons) {
  // Función auxiliar para ajustar la fecha UTC al huso horario local
  function toLocalISOString(date) {
    const offset = date.getTimezoneOffset() * 60000; // Desfase en milisegundos
    const localDate = new Date(date.getTime() - offset); // Ajusta la fecha al huso horario local
    return localDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  }

  // 3. Contar lecciones por día
  const counts = lessons.reduce((acc, { startDate }) => {
    // Convertir la fecha UTC a formato YYYY-MM-DD ajustado al huso horario local
    const dateKey = toLocalISOString(startDate);
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});
  console.log("*************** counts ***************", counts);

  // 4. Generar array de resultados para los próximos 7 días
  const result = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(lessons[0].startDate); // Fecha de la primera lección
    date.setDate(lessons[0].startDate.getDate() + i);
    // Convertir la fecha a formato YYYY-MM-DD ajustado al huso horario local
    const dateKey = toLocalISOString(date);
    return {
      day: dateKey,
      classes: counts[dateKey] || 0,
    };
  });
  console.log("*************** result ***************", result);

  // Mapeo de días de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
  const dayAbbreviations = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
  return result.map(({ day, classes }) => {
    const date = new Date(day); // Convierte la cadena YYYY-MM-DD a un objeto Date
    const dayOfWeek = date.getDay(); // Obtiene el día de la semana (0-6)
    return {
      day: dayAbbreviations[dayOfWeek], // Obtiene la abreviación correspondiente
      classes,
    };
  });
}

export function CardWeeklyChart({ nextSevenDaysData }) {
  return (
    <Card className="col-span-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700 flex items-center">
          <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
          Clases en los Próximos 7 Días
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full h-[400px] max-h-[30vh] sm:max-h-[40vh]">
        <ResponsiveContainer width="100%" height="100%" backgroundColor="red">
          <BarChart data={formatDaysOfWeek(nextSevenDaysData)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ fontWeight: "bold", color: "#4b5563" }}
            />
            <Bar dataKey="classes" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
