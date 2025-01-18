import { auth } from "@/auth";
import {
  CalendarUI,
  CardOverView,
  CardStatusLegendLesson,
  FormConfirmClass,
  FormLessonReport,
  FormReschedule,
} from "@/components";
import { DollarIcon } from "@/components/icons";
import { PopupDetailLesson } from "@/components/popupDetailLesson";
import Link from "next/link";

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

      <section className="px-2 py-3 flex flex-col md:flex-row justify-start gap-4 max-w-full mt-3 sm:mt-0">
        <CardOverView role={role[0]} id={user.id} />
        <CardStatusLegendLesson rol={role[0]} />
      </section>

      {role[0] === "student" && (
        <div className="absolute top-0 sm:top-2 right-2 sm:right-8">
          <Link
            href="/payment-methods"
            className="relative p-2 flex gap-1 rounded-full text-white bg-green-500 font-semibold"
          >
            <span className="animate-ping absolute inset-0 m-auto rounded-full inline-flex h-[65%] w-[65%] bg-green-400 opacity-70"></span>
            <DollarIcon />
            Paga Aquí
          </Link>
        </div>
      )}

      <CalendarUI rol={role[0]} />
    </div>
  );
}
