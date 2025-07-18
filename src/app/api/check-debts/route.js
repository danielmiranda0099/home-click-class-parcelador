import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { subWeeks } from "date-fns";
import { PendingPaymentEmail, WeeklyDebtReportEmail } from "@/emails";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const threeWeeksAgo = subWeeks(new Date(), 3);

  const students = await prisma.user.findMany({
    where: {
      role: { has: "student" },
      studentLessons: {
        some: {
          isStudentPaid: false,
          isConfirmed: true,
          lesson: { isCanceled: false },
        },
      },
    },
    select: {
      id: true,
      shortName: true,
      personalEmail: true,
      studentLessons: {
        where: {
          isStudentPaid: false,
          isConfirmed: true,
          lesson: { isCanceled: false },
        },
        select: {
          id: true,
          studentFee: true,
          lesson: {
            select: {
              startDate: true,
            },
          },
        },
      },
    },
  });

  const notifiedStudentsMap = new Map();

  for (const student of students) {
    const unpaidLessons = student.studentLessons;
    const unpaidCount = unpaidLessons.length;

    const hasOldDebts = unpaidLessons.some(
      (sl) => new Date(sl.lesson.startDate) < threeWeeksAgo
    );

    if (unpaidCount > 4 || hasOldDebts) {
      notifiedStudentsMap.set(student.id, {
        ...student,
        unpaidCount,
        hasOldDebts,
      });
    }
  }

  const debtors = Array.from(notifiedStudentsMap.values());
  const problemsStudnets = [];
  for (const student of debtors) {
    if (!student.personalEmail) {
      problemsStudnets.push(student.shortName);
      continue;
    }
    const { error } = await resend.emails.send({
      from: "HOME CLICK CLASS <noreply@gestion.homeclickclass.com>",
      to: student.personalEmail,
      subject: "HOME CLICK CLASS ALERTS",
      react: PendingPaymentEmail({ studentName: student.shortName }),
    });
    if (error) {
      problemsStudnets.push(student.shortName);
    }
  }

  // await resend.emails.send({
  //   from: "HOME CLICK CLASS <noreply@gestion.homeclickclass.com>",
  //   to: "danielmesa877@gmail.com",
  //   subject: "HOME CLICK CLASS ALERTS",
  //   react: PendingPaymentEmail({
  //     studentName: "danie miranda",
  //   }),
  // });

  const weekSummary = debtors.map((student) => {
    const totalAmount = student.studentLessons.reduce((acc, sl) => {
      return acc + (sl.studentFee ?? 0);
    }, 0);

    return {
      shortName: student.shortName,
      unpaidCount: student.unpaidCount,
      totalAmount,
    };
  });

  await resend.emails.send({
    from: "HOME CLICK CLASS <noreply@gestion.homeclickclass.com>",
    to: "araksamse@gmail.com",
    subject: `Resumen semanal de alertas de deuda - Semana ${format(new Date(), "'del' dd 'de' MMMM", { locale: es })}`,
    react: WeeklyDebtReportEmail({
      week: format(new Date(), "'del' dd 'de' MMMM", { locale: es }),
      students: weekSummary,
      problemsStudents: problemsStudnets,
    }),
  });

  return NextResponse.json({
    message: `Se notificaron ${debtors.length} estudiantes.`,
  });
}
