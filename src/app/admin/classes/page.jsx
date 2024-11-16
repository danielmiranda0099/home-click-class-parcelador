"use client";
//TODO: use client? quiero mantenerlo del lado del server
import {
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
import { useUserStore } from "@/store/userStore";
import { formatUsersForInputSearch } from "@/utils/formatUsersForInputSearch";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [users_formated, setUsersFormated] = useState(null);
  const [state_tab, setStatetab] = useState("calendar");
  const {
    users,
    setUsers,
    user_selected: user,
    setuserSelected: setUser,
  } = useUserStore();

  useEffect(() => {
    setUsers();
  }, []);

  useEffect(() => {
    if (users) {
      const users_formated = formatUsersForInputSearch(users);
      setUsersFormated(users_formated);
      console.log("users", users);
    }
  }, [users]);

  useEffect(() => {}, [user]);

  return (
    <>
      <FormLessonReport rol="admin" />
      <PopupDetailLesson rol="admin" />
      <FormReschedule rol="admin" />

      <CardStatusLegendLesson rol="admin" />

      <Tabs defaultValue="calendar">
        <div className="flex justify-center items-center p-2.5 rounded-md bg-muted w-fit mx-auto">
          <TabsList className="gap-4">
            <TabsTrigger
              className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-lg"
              value="calendar"
              onClick={() => setStatetab("calendar")}
            >
              Calendario
            </TabsTrigger>
            <TabsTrigger
              value="table"
              className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-lg"
              onClick={() => setStatetab("table")}
            >
              Lista
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-lg"
              onClick={() => setStatetab("payments")}
            >
              Pagos
            </TabsTrigger>
          </TabsList>
        </div>

        <section className="w-fit my-4 flex items-center gap-2 mx-auto">
          <InputSearch data={users_formated} value={user} setValue={setUser} />

          <FilterLesson isDisabled={state_tab === "payments"} />
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
      </Tabs>
    </>
  );
}
