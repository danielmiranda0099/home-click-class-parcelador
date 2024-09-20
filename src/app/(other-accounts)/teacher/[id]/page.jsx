import {
  CalendarUI,
  CardOverView,
  Card,
  CardStatusLegendLesson,
  Payments,
} from "@/components";
import { PopupDetailLesson } from "@/components/popupDetailLesson";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function TeacherPage() {
  return (
    <>
      <PopupDetailLesson rol={"teacher"} />
      <section className="px-10 py-3 flex flex-row justify-start gap-4">
        <CardOverView />
        <CardStatusLegendLesson rol="teacher" />
      </section>

      <section className="px-10 py-3">
        <Tabs defaultValue="calendar">
          <TabsList className="p-4 gap-4">
            <TabsTrigger
              className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-lg"
              value="calendar"
            >
              Calendar
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-lg"
            >
              payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <CalendarUI rol="teacher" />
          </TabsContent>

          <TabsContent value="payments">
            <Payments />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
