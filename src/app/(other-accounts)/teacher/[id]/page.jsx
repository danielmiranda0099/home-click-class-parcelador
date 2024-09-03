import { CalendarUI, CardOverView, CardUpcomingLesson } from "@/components";

export default async function TeacherPage() {
  return (
    <>
      <section className="px-48 py-3 flex flex-row gap-4 justify-around">
        <CardOverView />
      </section>

      <section className="px-48 py-3">
        <CalendarUI rol="teacher" />
      </section>
    </>
  );
}
