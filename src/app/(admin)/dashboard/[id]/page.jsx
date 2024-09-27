"use client";
//TODO: use client?
import {
  CalendarUI,
  CardStatusLegendLesson,
  FormReschedule,
  Payments,
  TableLessons,
} from "@/components";
import { PopupDetailLesson } from "@/components/popupDetailLesson";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";

export default function DashboardPage() {
  const { setUsers } = useUserStore();

  useEffect(() => {
    setUsers();
  }, []);

  return (
    <>
      <PopupDetailLesson rol="admin" />
      <FormReschedule rol="admin" />
      <section className="mb-4">
        <CardStatusLegendLesson rol="admin" />
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
