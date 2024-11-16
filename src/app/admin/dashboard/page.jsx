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
import {
  Calendar,
  DollarSign,
  Users,
  UserCheck,
  GraduationCap,
} from "lucide-react";

export default function DashboardPage() {
  // Datos de ejemplo para la gráfica
  const nextSevenDaysData = [
    { day: "Lun", classes: 5 },
    { day: "Mar", classes: 7 },
    { day: "Mié", classes: 4 },
    { day: "Jue", classes: 6 },
    { day: "Vie", classes: 8 },
    { day: "Sáb", classes: 3 },
    { day: "Dom", classes: 2 },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Clases Agendadas
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">35</div>
            <p className="text-xs text-gray-500 mt-1">
              Total de clases programadas
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pendientes (Profesores)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-xs text-gray-500 mt-1">
              Clases por pagar a profesores
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pendientes (Estudiantes)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <p className="text-xs text-gray-500 mt-1">
              Clases por cobrar a estudiantes
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Profesores
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">15</div>
            <p className="text-xs text-gray-500 mt-1">Profesores activos</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Estudiantes
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">78</div>
            <p className="text-xs text-gray-500 mt-1">
              Estudiantes registrados
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Clases en los Próximos 7 Días
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
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
    </div>
  );
}
