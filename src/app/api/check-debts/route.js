import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { subWeeks } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET_KEY) {
    console.log("****************************** no autorizado");
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
      firstName: true,
      email: true,
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

  for (const student of debtors) {
    const reason =
      student.unpaidCount > 4
        ? "más de 4 clases sin pagar"
        : "una clase vencida hace más de 3 semanas";

    console.log(
      `************ Hola ${student.firstName}, tienes ${student.unpaidCount} clases sin pagar (${reason}). Por favor ponte al día.`
    );

    // Descomenta para enviar email:
    // await resend.emails.send({
    //   from: "Academia <notificaciones@tudominio.com>",
    //   to: student.email,
    //   subject: "Tienes clases en deuda",
    //   html: `<p>Hola ${student.firstName}, tienes ${student.unpaidCount} clases sin pagar (${reason}). Por favor ponte al día.</p>`,
    // });
  }

  return NextResponse.json({
    message: `Se notificaron ${debtors.length} estudiantes.`,
  });
}
