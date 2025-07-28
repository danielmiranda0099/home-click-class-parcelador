import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { subWeeks, format } from "date-fns";
import { PendingPaymentEmail, WeeklyDebtReportEmail } from "@/emails";
import { es } from "date-fns/locale";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
  try {
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
    const problemsStudents = [];

    const isLimitEmails = debtors.length > 95;

    const validEmailStudents = debtors.filter((student) => {
      if (!student.personalEmail) {
        problemsStudents.push(student.shortName);
        return false;
      }
      return true;
    });

    const failedEmails = [];

    // Envío individual de correos con delay de 525ms
    for (const student of validEmailStudents) {
      try {
        const { error } = await resend.emails.send({
          from: "HOME CLICK CLASS <noreply@gestion.homeclickclass.com>",
          to: student.personalEmail,
          subject: "HOME CLICK CLASS ALERTS",
          react: PendingPaymentEmail({ studentName: student.shortName }),
        });
        if (error) {
          failedEmails.push({
            shortName: student.shortName,
            personalEmail: student.personalEmail,
            error: error,
          });
        }
      } catch (error) {
        console.error(
          `Error al enviar a ${student.shortName} (${student.personalEmail}):`,
          error
        );
        failedEmails.push({
          shortName: student.shortName,
          personalEmail: student.personalEmail,
          error: error || "Unknown error",
        });
      }

      // Esperar 525ms para cumplir rate limit de 2 req/s
      await new Promise((resolve) => setTimeout(resolve, 525));
    }

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

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay para separar el envío

    await resend.emails.send({
      from: "HOME CLICK CLASS <noreply@gestion.homeclickclass.com>",
      to: "araksamse@gmail.com",
      subject: `Resumen semanal de alertas de deuda - Semana ${format(new Date(), "'del' dd 'de' MMMM", { locale: es })}`,
      react: WeeklyDebtReportEmail({
        week: format(new Date(), "'del' dd 'de' MMMM", { locale: es }),
        students: weekSummary,
        problemsStudents: problemsStudents.concat(
          failedEmails.map(({ shortName }) => shortName)
        ),
        isLimitEmails: isLimitEmails,
      }),
    });

    console.log(`Estudiantes con deuda: ${students.length}
                Notificados: ${validEmailStudents.length}
                Sin correo: ${problemsStudents.length}
                Errores de envío: ${failedEmails.length}`);
    return NextResponse.json({
      message: `Estudiantes con deuda: ${students.length}
                Notificados: ${validEmailStudents.length}
                Sin correo: ${problemsStudents.length}
                Errores de envío: ${failedEmails.length}`,
      fallos: failedEmails,
    });
  } catch (error) {
    console.error("Error in end-point 'check-debts'", error);
    return NextResponse.json(
      { error: "Error interno del servidor, " + error },
      { status: 500 }
    );
  }
}
