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

/**
 * Desconfirma una lección para un estudiante y, si tiene éxito, elimina la deuda asociada.
 * revierte la confirmación de la lección y la StudentLesson.
 * También intenta revertir la actualización del averageScore del profesor.
 * @param prevState - Estado anterior (para useFormState).
 * @param formData - Datos del formulario, debe contener 'lesson_id'.
 */
export async function disconfirmLesson(lessonId, studentId) {
  try {
    const lesson_id = parseInt(lessonId, 10);
    const student_id = parseInt(studentId, 10);
    if (isNaN(lesson_id) || isNaN(student_id)) {
      return RequestResponse.error("Invalid IDs.");
    }

    const studentLessonRecord = await prisma.studentLesson.findUnique({
      where: {
        studentId_lessonId: { studentId: student_id, lessonId: lesson_id },
      },
      include: {
        lesson: {
          include: {
            teacher: {
              select: { averageScore: true },
            },
          },
        },
      },
    });

    if (!studentLessonRecord) {
      return RequestResponse.error("Registro de StudentLesson no encontrado.");
    }

    await prisma.$transaction(async (tx) => {
      await tx.studentLesson.update({
        where: {
          studentId_lessonId: {
            studentId: student_id,
            lessonId: lesson_id,
          },
        },
        data: {
          isConfirmed: false,
          lessonScore: null,
          studentObservations: null,
        },
      });

      const otherConfirmedStudentLessons = await tx.studentLesson.findMany({
        where: {
          lessonId: lesson_id,
          isConfirmed: true,
        },
        select: { id: true },
        take: 1,
      });

      const newLessonConfirmedStatus = otherConfirmedStudentLessons.length > 0;

      // Update lesson isConfirmed
      await tx.lesson.update({
        where: { id: lesson_id },
        data: {
          isConfirmed: newLessonConfirmedStatus,
          isRegistered: false,
        },
      });

      //Adjust Teacher averageScore
      const teacherId = studentLessonRecord.lesson.teacherId;
      const teacher = await tx.user.findUnique({
        where: { id: teacherId },
        select: { averageScore: true },
      });
      if (teacher) {
        let updateTeacherAverage = teacher.averageScore + 0.3;
        await tx.user.update({
          where: { id: teacherId },
          data: { averageScore: updateTeacherAverage },
        });
      } else {
        console.warn(
          `Profesor con ID ${teacherId} no encontrado para revertir averageScore.`
        );
      }
      const debtDeletionResult = await deleteDebt(lesson_id, student_id, tx);
      if (!debtDeletionResult.success) {
        //Rollback
        throw new Error(
          "Falló la eliminación de la deuda, revirtiendo cambios de desconfirmación."
        );
      }
    });

    return RequestResponse.success();
  } catch (error) {
    console.error("Error en desconfirmLesson():", error);
    return RequestResponse.error(
      error.message || "Falló la desconfirmación de la lección."
    );
  }
}

async function deleteDebt(lesson_id, student_id, tx) {
  const prismaClient = tx || prisma;
  try {
    await prismaClient.debt.deleteMany({
      where: {
        lessonId: lesson_id,
        userId: student_id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(
      `Error in deleteDebt() for lesson ${lesson_id}, student ${student_id}:`,
      error
    );
    if (!tx) throw error;
    return { success: false };
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
            expenseCategory: "teacher",
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
          expenseCategory: transaction.expenseCategory, // Categoría de gasto
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
            expenseCategory: transaction.expenseCategory, // Categoría de gasto
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
