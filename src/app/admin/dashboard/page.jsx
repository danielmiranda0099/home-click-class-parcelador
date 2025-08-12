import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarIcon,
  DollarIcon,
  GraduationIcon,
  UsersIcon,
} from "@/components/icons";
import { CardWeeklyChart } from "@/components";
import { dataDashboard } from "@/actions/CrudLesson";
import { formatCurrency } from "@/utils/formatCurrency";

const nextSevenDaysDataDefault = [
  { day: "Lu", classes: 0 },
  { day: "Ma", classes: 0 },
  { day: "Mi", classes: 0 },
  { day: "Ju", classes: 0 },
  { day: "Vi", classes: 0 },
  { day: "Sa", classes: 0 },
  { day: "Do", classes: 0 },
];

export default async function DashboardPage() {
  let data = {
    scheduledLessons: 0,
    unpaidTeacherLessons: 0,
    unpaidTeacherTotal: 0,
    unpaidStudentLessons: 0,
    unpaidStudentTotal: 0,
    scheduledAndPaidLessons: 0,
    totalScheduledAndPaid: 0,
    totalIncome: 0,
    totalExpenseTeacher: 0,
    teacherCount: 0,
    studentCount: 0,
    weeklyClasses: nextSevenDaysDataDefault,
  };

  const response = await dataDashboard(
    new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
  );

  if (response.success) {
    data = response.data;
  }

  return (
    <div className="p-0 sm:p-4 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-center md:justify-start  gap-2 sm:gap-4 flex-wrap">
        <Card className="w-44 lg:w-64">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pendientes (Profesores)
            </CardTitle>
            <DollarIcon size="2rem" className="text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold text-red-400">
              {formatCurrency(data.unpaidTeacherTotal)}
            </p>
            <p>{data.unpaidTeacherLessons} clases</p>
            <p className="text-xs text-gray-500 mt-1">
              Total por pagar a profesores
            </p>
          </CardContent>
        </Card>

        <Card className="w-44 lg:w-64">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pendientes (Estudiantes)
            </CardTitle>
            <DollarIcon size="2rem" className="text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold text-yellow-500">
              {formatCurrency(data.unpaidStudentTotal)}
            </p>
            <p>{data.unpaidStudentLessons} clases</p>
            <p className="text-xs text-gray-500 mt-1">
              Total a cobrar a estudiantes
            </p>
          </CardContent>
        </Card>

        <Card className="w-44 lg:w-64">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Agendadas y Pagadas
            </CardTitle>
            <DollarIcon size="2rem" className="text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              {formatCurrency(data.totalScheduledAndPaid)}
            </p>
            <p>{data.scheduledAndPaidLessons} clases</p>
            <p className="text-xs text-gray-500 mt-1">Total abonado</p>
          </CardContent>
        </Card>
        <Card className="w-44 lg:w-64">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Clases Agendadas
            </CardTitle>
            <CalendarIcon size="2rem" color="#3b82f6" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-3xl font-bold text-blue-400">
              {data.scheduledLessons}
            </div>
          </CardContent>
        </Card>

        <Card className="w-44 lg:w-64">
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

        <Card className="w-44 lg:w-64">
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
            <p className="text-xs text-gray-500 mt-1">Estudiantes activos</p>
          </CardContent>
        </Card>

        <Card className="w-44 lg:w-64">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Ingresos
            </CardTitle>
            <DollarIcon size="2rem" className="text-green-400" />
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold text-green-400">
              {formatCurrency(data.totalIncome)}
            </p>
          </CardContent>
        </Card>

        <Card className="w-44 lg:w-64">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Egresos Profesor
            </CardTitle>
            <DollarIcon size="2rem" className="text-red-400" />
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold text-red-400">
              {formatCurrency(data.totalExpenseTeacher)}
            </p>
          </CardContent>
        </Card>
      </div>

      <CardWeeklyChart nextSevenDaysData={data?.weeklyClasses} />
    </div>
  );
}
