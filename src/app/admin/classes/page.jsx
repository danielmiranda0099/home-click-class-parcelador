"use client";
//TODO: use client? quiero mantenerlo del lado del server
import {
  ActionLessons,
  CalendarUI,
  CardStatusLegendLesson,
  FilterLesson,
  FormLessonReport,
  FormReschedule,
  InputSearch,
  Payments,
  TableLessons,
} from "@/components";
import { CalendarBalance } from "@/components/calendar";
import { PopupDetailLesson } from "@/components/popupDetailLesson";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserSession } from "@/hooks";
import { useLessonsStore } from "@/store/lessonStore";
import { useUserStore } from "@/store/userStore";
import { MONTHS_OF_YEAR } from "@/utils/constans";
import { formatUsersForInputSearch } from "@/utils/formatUsersForInputSearch";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [users_formated, setUsersFormated] = useState(null);
  const [count_lessons_by_month, setCountLessonsByMonth] = useState(0);
  const [state_tab, setStatetab] = useState("calendar");
  const {
    users,
    setUsers,
    user_selected,
    setuserSelected: setUser,
  } = useUserStore();
  const { lessons_filtered } = useLessonsStore();
  const user_session = useUserSession();

  const searchParams = useSearchParams();

  function countLessonsByYearAndMonth(year, month) {
    return lessons_filtered?.reduce((count, lesson) => {
      const lessonDate = new Date(lesson.startDate);
      if (
        lessonDate.getFullYear() === year &&
        lessonDate.getMonth() + 1 === month
      ) {
        return count + 1;
      }
      return count;
    }, 0);
  }

  useEffect(() => {
    if (users) {
      const users_formated = formatUsersForInputSearch(users);
      setUsersFormated(users_formated);
    }
  }, [users]);

  useEffect(() => {
    if (
      searchParams.get("month") &&
      searchParams.get("year") &&
      lessons_filtered?.length > 0
    ) {
      const year = parseInt(searchParams.get("year"));
      const month = parseInt(searchParams.get("month"));

      const count_lessons_by_month = countLessonsByYearAndMonth(year, month);

      setCountLessonsByMonth(count_lessons_by_month);
    }
  }, [searchParams, lessons_filtered]);

  return (
    <section className="overflow-hidden max-w-full">
      <FormLessonReport rol="admin" />
      <PopupDetailLesson rol="admin" user={user_session?.user} />
      <FormReschedule />

      <CardStatusLegendLesson rol="admin" />

      <Tabs defaultValue="calendar">
        <div className="flex justify-center items-center p-1.5 sm:p-2.5 rounded-md bg-muted w-fit max-w-full mx-auto mt-10 sm:mt-0">
          <TabsList className="gap-1 sm:gap-4">
            <TabsTrigger
              className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-base sm:text-lg"
              value="calendar"
              onClick={() => setStatetab("calendar")}
            >
              Calendario
            </TabsTrigger>
            <TabsTrigger
              value="table"
              className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-base sm:text-lg"
              onClick={() => setStatetab("table")}
            >
              Lista
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-base sm:text-lg"
              onClick={() => setStatetab("payments")}
            >
              Pagos
            </TabsTrigger>
            <TabsTrigger
              value="actions"
              className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-base sm:text-lg"
              onClick={() => setStatetab("actions")}
            >
              Acciones
            </TabsTrigger>
          </TabsList>
        </div>

        <section className="w-fit my-4 flex flex-col sm:flex-row items-center gap-2 mx-auto">
          <InputSearch
            data={users_formated}
            value={user_selected}
            setValue={setUser}
            disabled={state_tab === "actions"}
          />

          <FilterLesson
            isDisabled={state_tab === "payments" || state_tab === "actions"}
          />
        </section>

        <section className="h-1.5 w-fit my-4 flex flex-col sm:flex-row items-center gap-2 mx-auto">
          {(state_tab === "calendar" || state_tab === "table") && (
            <p className="text-lg font-medium">
              Clases en {MONTHS_OF_YEAR[searchParams.get("month")]}:{" "}
              <span className="font-bold">{count_lessons_by_month}</span>
            </p>
          )}
        </section>

        <CalendarBalance lessons={lessons_filtered} isDisabled={state_tab === "payments" || state_tab === "actions"}/>

        <TabsContent value="calendar">
          <CalendarUI rol="admin" />
        </TabsContent>

        <TabsContent value="table">
          <TableLessons />
        </TabsContent>

        <TabsContent value="payments">
          <Payments />
        </TabsContent>

        <TabsContent value="actions">
          <ActionLessons />
        </TabsContent>
      </Tabs>
    </section>
  );
}
