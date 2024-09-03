import {
  CalendarUI,
  CardOverView,
  CardUpcomingLesson,
  FormConfirmClass,
} from "@/components";

export default function StudentsPage() {
  return (
    <>
      <FormConfirmClass />
      <section className="px-48 py-3 flex flex-row gap-4 justify-around">
        <CardOverView />
      </section>

      <section className="px-48 py-3">
        <CalendarUI rol="student" />
      </section>
    </>
  );
}
