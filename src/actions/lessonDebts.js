"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { RequestResponse } from "@/utils/requestResponse";
import { getMonth, getWeek, getYear } from "date-fns";

export async function confirmLessonAndRegisterDebt(prev, data_form) {
  try {
    let {
      lesson_id,
      teacherId,
      lessonScore,
      currentAverageScore,
      studentObservations,
    } = data_form;

    if (!lesson_id || !lessonScore || !teacherId || !currentAverageScore) {
      throw new Error(
        "Fild Problems !lesson_id || !lessonScore || !teacherId || !currentAverageScore"
      );
    }

    const { user } = await auth();

    if (!user) {
      throw new Error("Not found user auth()");
    }

    const student_id = parseInt(user.id, 10);
    lesson_id = parseInt(lesson_id, 10);
    teacherId = parseInt(teacherId, 10);

    const student_lesson = await prisma.studentLesson.findUnique({
      where: {
        studentId_lessonId: {
          studentId: student_id,
          lessonId: lesson_id,
        },
      },
    });

    if (!student_lesson) {
      throw new Error("Not found student lesson");
    }

    const current_date = new Date();
    const year = getYear(current_date);
    const month = getMonth(current_date) + 1;
    const week = getWeek(current_date);

    await prisma.$transaction(async (tx) => {
      await tx.lesson.update({
        where: { id: lesson_id },
        data: {
          isConfirmed: true,
          studentLessons: {
            update: {
              where: {
                studentId_lessonId: {
                  lessonId: lesson_id,
                  studentId: student_id,
                },
              },
              data: {
                lessonScore,
                isConfirmed: true,
                ...(studentObservations !== undefined &&
                  studentObservations && {
                    studentObservations: studentObservations,
                  }),
              },
            },
          },
          teacher: {
            update: {
              averageScore: (currentAverageScore + lessonScore) / 2,
            },
          },
        },
      });

      if (!student_lesson.isStudentPaid) {
        await tx.debt.create({
          data: {
            date: current_date.toISOString(),
            amount: student_lesson.studentFee,
            type: "income",
            concept: `Pago estudiante ${user.name}`,
            lessonId: lesson_id,
            userId: parseInt(user.id, 10),
            year: year,
            month: month,
            week: week,
          },
        });
      }
    });

    return RequestResponse.success();
  } catch (error) {
    console.error("Error in confirmLessonAndRegisterDebt()", error);
    return RequestResponse.error();
  }
}

export async function registerAndSaveLessonReportAndRegisterDebt(
  prev,
  form_data
) {
  try {
    let {
      isConfirmed,
      issues,
      lesson_id,
      otherObservations,
      teacherObservations,
      topic,
      week_lesson,
    } = form_data;

    if (!lesson_id) throw new Error("Error in Field lessonId");

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lesson_id,
      },
      select: {
        teacherPayment: true,
      },
    });

    if (!lesson) throw new Error("Lesson not found");

    if (!week_lesson || !topic || !teacherObservations)
      throw new Error(
        "Filed problems in !week_lesson || !topic || !teacherObservations"
      );

    const { user } = await auth();

    if (!user) {
      throw new Error("Not found user in auth()");
    }

    const where_clause = {
      id: lesson_id,
      isCanceled: false,
    };
    if (isConfirmed) {
      where_clause.isConfirmed = true;
    }

    const current_date = new Date();
    const year = getYear(current_date);
    const month = getMonth(current_date) + 1;
    const week = getWeek(current_date);

    await prisma.$transaction(async (tx) => {
      await tx.lesson.update({
        where: where_clause,
        data: {
          week: week_lesson,
          topic,
          teacherObservations,
          ...(isConfirmed && {
            isRegistered: true,
          }),
          ...(issues && {
            issues,
          }),
          ...(otherObservations && {
            otherObservations,
          }),
        },
      });

      if (isConfirmed) {
        await tx.debt.create({
          data: {
            date: current_date.toISOString(),
            amount: lesson.teacherPayment,
            type: "expense",
            concept: `Pago a profesor ${user.name}`,
            lessonId: lesson_id,
            userId: parseInt(user.id, 10),
            year: year,
            month: month,
            week: week,
          },
        });
      }
    });

    return RequestResponse.success();
  } catch (error) {
    console.error(
      "Error in registerAndSaveLessonReportAndRegisterDebt()",
      error
    );
    return RequestResponse.error();
  }
}

/**
 * Cancela el pago de una lección asociada a un profesor.
 * Elimina la transacción y la registra como deuda, asegurando la atomicidad con una transacción.
 *
 * @param {number} lessonId - ID de la lección
 * @param {number} teacherId - ID del profesor
 */
export async function cancelTeacherPaymentAndRegisterDebt(lessonId, teacherId) {
  try {
    await prisma.$transaction(async (tx) => {
      // Verificar si la transacción existe
      const transaction = await tx.transaction.findFirst({
        where: {
          lessonId: lessonId,
          userId: teacherId,
        },
      });

      await tx.lesson.update({
        where: {
          id: lessonId,
        },
        data: {
          isTeacherPaid: false,
        },
      });

      if (!transaction) {
        throw new Error(
          "No se encontró una transacción asociada a esta lección y profesor."
        );
      }
      const current_date = new Date();
      const year = getYear(current_date);
      const month = getMonth(current_date) + 1;
      const week = getWeek(current_date);
      // Crear la deuda basada en la transacción existente
      await tx.debt.create({
        data: {
          date: current_date.toISOString(), // Fecha actual
          amount: transaction.amount, // Monto de la deuda
          type: "expense", // Mismo tipo que la transacción eliminada
          concept: transaction.concept, // Descripción de la deuda
          lessonId: transaction.lessonId, // Asociada a la misma lección
          userId: transaction.userId, // Asociada al mismo profesor
          year: year,
          month: month,
          week: week,
        },
      });

      // Eliminar la transacción
      await tx.transaction.delete({
        where: {
          id: transaction.id,
        },
      });
    });
    return RequestResponse.success();
  } catch (error) {
    console.error("Error in cancelTeacherPayment()", error);
    return RequestResponse.error();
  }
}

/**
 * Cancela el pago de una lección asociada a un profesor.
 * Elimina la transacción y la registra como deuda, asegurando la atomicidad con una transacción.
 *
 * @param {number} lessonId - ID de la lección
 * @param {number} studentId - ID del profesor
 */
export async function cancelStudentPaymentAndRegisterDebt(lessonId, studentId) {
  try {
    await prisma.$transaction(async (tx) => {
      // Verificar si la transacción existe
      const transaction = await tx.transaction.findFirst({
        where: {
          lessonId: lessonId,
          userId: studentId,
        },
      });

      const lesson = await tx.lesson.findUnique({
        where: {
          id: lessonId,
        },
      });

      await tx.studentLesson.update({
        where: {
          studentId_lessonId: {
            studentId: studentId,
            lessonId: lessonId,
          },
        },
        data: {
          isStudentPaid: false,
        },
      });

      if (!transaction || !lesson) {
        throw new Error(
          "No se encontró una transacción asociada a esta lección y profesor."
        );
      }
      if (lesson.isConfirmed) {
        const current_date = new Date();
        const year = getYear(current_date);
        const month = getMonth(current_date) + 1;
        const week = getWeek(current_date);
        // Crear la deuda basada en la transacción existente
        await tx.debt.create({
          data: {
            date: current_date.toISOString(), // Fecha actual
            amount: transaction.amount, // Monto de la deuda
            type: "income", // Mismo tipo que la transacción eliminada
            concept: transaction.concept, // Descripción de la deuda
            lessonId: transaction.lessonId, // Asociada a la misma lección
            userId: transaction.userId, // Asociada al mismo profesor
            year: year,
            month: month,
            week: week,
          },
        });
      }

      // Eliminar la transacción
      await tx.transaction.delete({
        where: {
          id: transaction.id,
        },
      });
    });
    return RequestResponse.success();
  } catch (error) {
    console.error("Error in cancelStudentPaymentAndRegisterDebt()", error);
    return RequestResponse.error();
  }
}
