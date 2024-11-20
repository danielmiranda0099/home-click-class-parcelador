import { auth } from "@/auth";
import {
  CalendarUI,
  CardOverView,
  CardStatusLegendLesson,
  FormConfirmClass,
  FormLessonReport,
  FormReschedule,
  PopupImagePay,
} from "@/components";
import { PopupDetailLesson } from "@/components/popupDetailLesson";

export default async function ClassesPage() {
  const session = await auth();
  const {
    user: { role },
    user,
  } = session;
  return (
    <div className="w-full relative">
      {role[0] === "student" && <FormConfirmClass />}

      {role[0] === "teacher" && <FormLessonReport rol="teacher" />}
      {role[0] === "teacher" && <FormReschedule rol="teacher" />}

      <PopupDetailLesson rol={role[0]} user={user} />

      <section className="px-10 py-3 flex flex-row justify-start gap-4">
        <CardOverView role={role[0]} id={user.id} />
        <CardStatusLegendLesson rol={role[0]} />
      </section>

      {role[0] === "student" && (
        <div className="absolute top-2 right-8">
          <PopupImagePay />
        </div>
      )}

      <section className="px-10 py-3">
        <CalendarUI rol={role[0]} />
      </section>
    </div>
  );
}
