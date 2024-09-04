import {
  CalendarUI,
  CardOverView,
  Card,
  CardStatusLegendLesson,
} from "@/components";

export default async function TeacherPage() {
  return (
    <>
      <section className="px-10 py-3 flex flex-row justify-start gap-4">
        <CardOverView />
        <CardStatusLegendLesson rol="teacher" />
      </section>

      <section className="px-10 py-3">
        <CalendarUI rol="teacher" />
      </section>
    </>
  );
}
