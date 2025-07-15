import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET_KEY) {
    console.log("****************************** no autorizado");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
        select: { id: true },
      },
    },
  });

  const debtors = students.filter((s) => s.studentLessons.length > 4);

  // for (const student of debtors) {
  //   await resend.emails.send({
  //     from: "Academia <notificaciones@tudominio.com>",
  //     to: student.email,
  //     subject: "Tienes clases en deuda",
  //     html: `<p>Hola ${student.firstName}, tienes ${student.studentLessons.length} clases sin pagar. Por favor ponte al día.</p>`,
  //   });
  // }

  console.log(
    "************ students debs *********",
    JSON.stringify(students, null, 2)
  );
  for (const student of debtors) {
    console.log(
      `************ Hola ${student.firstName}, tienes ${student.studentLessons.length} clases sin pagar. Por favor ponte al día`
    );
  }

  // await resend.emails.send({
  //   from: "Academia <onboarding@resend.dev>",
  //   to: "danielmesa877@gmail.com",
  //   subject: "Tienes clases en deuda",
  //   html: `<p>Hola ${"Daniel"}, tienes ${debtors.length} clases sin pagar. Por favor ponte al día.</p>`,
  // });

  return NextResponse.json({
    message: `Se notificaron ${debtors.length} estudiantes.`,
  });
}
