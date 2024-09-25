import prisma from "../lib/prisma.js";
import moment from "moment";

async function main() {
  await prisma.lesson.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios: estudiante, profesor y administrador
  const student = await prisma.user.create({
    data: {
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan.perez@example.com",
      phoneNumber: "555-1234",
      city: "Bogotá",
      country: "Colombia",
      role: "student",
    },
  });

  const teacher = await prisma.user.create({
    data: {
      firstName: "Carlos",
      lastName: "Ramírez",
      email: "carlos.ramirez@example.com",
      phoneNumber: "555-5678",
      city: "Medellín",
      country: "Colombia",
      role: "teacher",
    },
  });

  const admin = await prisma.user.create({
    data: {
      firstName: "Maria",
      lastName: "Gómez",
      email: "maria.gomez@example.com",
      phoneNumber: "555-7890",
      city: "Cali",
      country: "Colombia",
      role: "admin",
    },
  });

  // Fecha de inicio para las lecciones (cada viernes)
  const firstLessonDate = moment().day(5).startOf("day"); // próximo viernes

  // Crear 5 lecciones, una por semana cada viernes
  for (let i = 0; i < 5; i++) {
    const lessonDate = firstLessonDate.clone().add(i, "weeks").toDate();
    await prisma.lesson.create({
      data: {
        startDate: lessonDate,
        topic: `Lesson ${i + 1}`,
        student: {
          connect: { id: student.id },
        },
        teacher: {
          connect: { id: teacher.id },
        },
        teacherPayment: 10000,
        studentFee: 30000,
        week: `Week ${i + 1}`,
      },
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error("Error:", e.message); // Muestra el mensaje de error
    console.error(e); // Muestra el error completo con el stack trace
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
