import { CalendarUI, CardOverView, CardUpcomingLesson } from "@/components";

export default function StudentsPage() {
  return (
    <>
      <section className="px-48 py-3 flex flex-row gap-4 justify-around">
        <CardUpcomingLesson rol="student" />

        <CardOverView />
      </section>

      <section className="px-48 py-3">
        <CalendarUI rol="student" />
      </section>
    </>
  );
}
