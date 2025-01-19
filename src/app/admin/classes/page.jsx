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
import { PopupDetailLesson } from "@/components/popupDetailLesson";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserSession } from "@/hooks";
import { useUserStore } from "@/store/userStore";
import { formatUsersForInputSearch } from "@/utils/formatUsersForInputSearch";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [users_formated, setUsersFormated] = useState(null);
  const [state_tab, setStatetab] = useState("calendar");
  const {
    users,
    setUsers,
    user_selected,
    setuserSelected: setUser,
  } = useUserStore();
  const user_session = useUserSession();

  useEffect(() => {
    if (users) {
      const users_formated = formatUsersForInputSearch(users);
      setUsersFormated(users_formated);
    }
  }, [users]);

  useEffect(() => {}, [user_selected]);

  return (
    <section className="overflow-hidden max-w-full">
      <FormLessonReport rol="admin" />
      <PopupDetailLesson rol="admin" user={user_session?.user} />
      <FormReschedule rol="admin" />

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
