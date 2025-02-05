import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarIcon,
  DollarIcon,
  GraduationIcon,
  UsersIcon,
} from "@/components/icons";
import { CardWeeklyChart } from "@/components";
import { dataDashboard } from "@/actions/CrudLesson";

export default async function DashboardPage() {
  let data = {
    scheduledLessons: 0,
    unpaidTeacherLessons: 0,
    unpaidStudentLessons: 0,
    teacherCount: 0,
    studentCount: 0,
  };

  const response = await dataDashboard();

  if (response.success) {
    data = response.data;
  }

  return (
    <div className="p-0 sm:p-4 space-y-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:gap-4">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Clases Agendadas
            </CardTitle>
            <CalendarIcon size={"2rem"} color="#3b82f6" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-4xl font-bold text-blue-400">
              {data.scheduledLessons}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total de clases programadas
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pendientes (Profesores)
            </CardTitle>
            <DollarIcon size={"2rem"} className="text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-4xl font-bold text-red-400">
              {data.unpaidTeacherLessons}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Clases por pagar a profesores
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pendientes (Estudiantes)
            </CardTitle>
            <DollarIcon size={"2rem"} className="text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-4xl font-bold text-yellow-500">
              {data.unpaidStudentLessons}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Clases por cobrar a estudiantes
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Profesores
            </CardTitle>
            <UsersIcon size={"2rem"} className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-4xl font-bold text-green-400">
              {data.teacherCount}
            </div>
            <p className="text-xs text-gray-500 mt-1">Profesores activos</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Estudiantes
            </CardTitle>
            <GraduationIcon size={"2rem"} className="text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-4xl font-bold text-purple-400">
              {data.studentCount}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Estudiantes activos
            </p>
          </CardContent>
        </Card>
      </div>

      <CardWeeklyChart />
    </div>
  );
}
