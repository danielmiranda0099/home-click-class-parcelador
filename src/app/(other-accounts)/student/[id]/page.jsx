import {
  CalendarUI,
  CardOverView,
  CardStatusLegendLesson,
  CardUpcomingLesson,
  FormConfirmClass,
} from "@/components";

export default function StudentsPage() {
  return (
    <>
      <FormConfirmClass />
      <section className="px-10 py-3 flex flex-row justify-start gap-4">
        <CardOverView />
        <CardStatusLegendLesson rol="student" />
      </section>

      <section className="px-10 py-3">
        <CalendarUI rol="student" />
      </section>
    </>
  );
}
