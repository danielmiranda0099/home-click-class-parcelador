"use client";
//TODO: use client? quiero mantenerlo del lado del server
import {
  CalendarUI,
  CardStatusLegendLesson,
  FormLessonReport,
  FormReschedule,
  InputSearch,
  Payments,
  TableLessons,
} from "@/components";
import { PopupDetailLesson } from "@/components/popupDetailLesson";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/store/userStore";
import { formatUserByRole } from "@/utils/formatUsersByRole";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [users_formated, setUsersFormated] = useState(null);
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
      const users_formated = formatUserByRole(users);
      setUsersFormated(users_formated);
      console.log("users", users);
    }
  }, [users]);

  return (
    <>
      <FormLessonReport rol="admin" />
      <PopupDetailLesson rol="admin" />
      <FormReschedule rol="admin" />
      <section className="mb-4">
        <CardStatusLegendLesson rol="admin" />
      </section>

      <section className="w-full mb-4 flex flex-col items-center">
        <div>
          <InputSearch data={users_formated} value={user} setValue={setUser} />
        </div>
      </section>

      <Tabs defaultValue="calendar">
        <TabsList className="p-4 gap-4">
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-lg"
            value="calendar"
          >
            Calendario
          </TabsTrigger>
          <TabsTrigger
            value="table"
            className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-lg"
          >
            Lista
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-lg"
          >
            Pagos
          </TabsTrigger>
        </TabsList>

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
