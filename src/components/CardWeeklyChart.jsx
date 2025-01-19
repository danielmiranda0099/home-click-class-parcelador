"use client";
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

const nextSevenDaysData = [
  { day: "Lun", classes: 5 },
  { day: "Mar", classes: 7 },
  { day: "Mié", classes: 4 },
  { day: "Jue", classes: 6 },
  { day: "Vie", classes: 8 },
  { day: "Sáb", classes: 3 },
  { day: "Dom", classes: 2 },
];

export function CardWeeklyChart() {
  return (
    <Card className="col-span-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700 flex items-center">
          <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
          Clases en los Próximos 7 Días
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full h-[400px] max-h-[40vh] bg-red-100">
        <ResponsiveContainer width="100%" height="100%" backgroundColor="red">
          <BarChart data={nextSevenDaysData}>
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
