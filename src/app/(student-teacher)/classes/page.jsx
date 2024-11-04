import {
  CalendarUI,
  CardOverView,
  CardStatusLegendLesson,
  FormConfirmClass,
} from "@/components";
import { PopupDetailLesson } from "@/components/popupDetailLesson";

export default function ClassesPage() {
  return (
    <>
      <FormConfirmClass />
      <PopupDetailLesson />
      <section className="px-10 py-3 flex flex-row justify-start gap-4">
        <CardOverView />
        <CardStatusLegendLesson />
      </section>

      <section className="px-10 py-3">
        <CalendarUI />
      </section>
    </>
  );
}
