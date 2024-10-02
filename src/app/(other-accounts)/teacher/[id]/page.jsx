import {
  CalendarUI,
  CardOverView,
  CardStatusLegendLesson,
  FormLessonReport,
} from "@/components";
import { PopupDetailLesson } from "@/components/popupDetailLesson";

export default async function TeacherPage() {
  return (
    <>
      <PopupDetailLesson rol={"teacher"} />
      <FormLessonReport rol="teacher" />
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
