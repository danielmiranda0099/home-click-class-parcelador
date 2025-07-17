import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { subWeeks } from "date-fns";
import { PendingPaymentEmail } from "@/emails";

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
      from: "HOME CLICK CLASS <onboarding@resend.dev>",
      to: student.personalEmail,
      subject: "HOME CLICK CLASS ALERTS",
      react: PendingPaymentEmail({ studentName: student.shortName }),
    });
    if (error) {
      problemsStudnets.push(student.shortName);
    }
  }

  return NextResponse.json({
    message: `Se notificaron ${debtors.length} estudiantes.`,
    data: data,
  });
}
