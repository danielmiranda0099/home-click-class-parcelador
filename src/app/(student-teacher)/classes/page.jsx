import { auth } from "@/auth";
import {
  CalendarUI,
  CardOverView,
  CardStatusLegendLesson,
  FormConfirmClass,
  FormLessonReport,
} from "@/components";
import { PopupDetailLesson } from "@/components/popupDetailLesson";

export default async function ClassesPage() {
  const session = await auth();
  const {
    user: { role },
  } = session;
  console.log("session", session);
  return (
    <>
      {role[0] === "student" && <FormConfirmClass />}
      {role[0] === "teacher" && <FormLessonReport rol="teacher" />}
      <PopupDetailLesson rol={role[0]} />
      <section className="px-10 py-3 flex flex-row justify-start gap-4">
        <CardOverView />
        <CardStatusLegendLesson rol={role[0]} />
      </section>

      <section className="px-10 py-3">
        <CalendarUI rol={role[0]} />
      </section>
    </>
  );
}
