"use server";
import prisma from "@/lib/prisma";
import { RequestResponse } from "@/utils/requestResponse";
import { getMonth, getWeek, getYear } from "date-fns";

export async function payStudentLessonsAndRegisterTransactions(
  student_lesson_ids
) {
  try {
    if (!student_lesson_ids || student_lesson_ids.length < 1) {
      throw new Error(
        "Field problems in !student_lesson_ids || student_lesson_ids.length < 1"
      );
    }

    const student_lessons = await prisma.studentLesson.findMany({
      where: {
        id: {
          in: student_lesson_ids,
        },
      },
      select: {
        id: true,
        studentId: true,
        lessonId: true,
        studentFee: true,
        isConfirmed: true,
      },
    });
    
    if (student_lesson_ids.length !== student_lessons.length) {
      throw new Error(
        "Error in student_lesson_ids.length !== student_lessons.length"
      );
    }

    const student_lessons_confirmed_filtered = student_lessons.filter(
      (student_lesson) => student_lesson.isConfirmed === true
    );

    const lesson_debt_ids = student_lessons_confirmed_filtered.map(
      (student_lesson) => student_lesson.lessonId
    );

    const user_id = student_lessons[0].studentId;

    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        shortName: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }
    
    const current_date = new Date();
    const year = getYear(current_date);
    const month = getMonth(current_date) + 1;
    const week = getWeek(current_date);

    const data_transactions = student_lessons.map((student_lesson) => ({
      date: current_date.toISOString(),
      amount: student_lesson.studentFee,
      type: "income",
      concept: `Pago estudiante ${user.shortName}`,
      lessonId: student_lesson.lessonId,
      userId: user_id,
      year: year,
      month: month,
      week: week,
    }));
    
    await prisma.$transaction(async (tx) => {
      if (lesson_debt_ids.length > 0) {
        await tx.debt.deleteMany({
          where: {
            lessonId: {
              in: lesson_debt_ids,
            },
            userId: user_id,
          },
        });
      }

      await tx.transaction.createMany({
        data: data_transactions,
      });

      await tx.studentLesson.updateMany({
        where: {
          id: {
            in: student_lesson_ids,
          },
        },
        data: {
          isStudentPaid: true,
        },
      });
    });

    return RequestResponse.success();
  } catch (error) {
    console.error(
      "Error in payStudentLessonsAndRegisterTransactions():",
      error
    );
    return RequestResponse.error();
  }
}
