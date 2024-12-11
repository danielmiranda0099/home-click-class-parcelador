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
    console.log(data_form)
    if (!lesson_id || !lessonScore || !teacherId || !currentAverageScore) {
      throw new Error('Fild Problems !lesson_id || !lessonScore || !teacherId || !currentAverageScore');
    }

    const { user } = await auth();

    if (!user) {
      throw new Error('Not found user auth()');
    }

    const student_id = parseInt(user.id, 10);
    lesson_id = parseInt(lesson_id, 10);
    teacherId = parseInt(teacherId, 10);

    const student_lesson = await prisma.studentLesson.findUnique({
      where: {
        studentId_lessonId: {
          studentId: student_id,
          lessonId: lesson_id
        }
      }
    });

    if(!student_lesson){
      throw new Error('Not found student lesson');
    }

    const current_date =  new Date();
    const year = getYear(current_date);
    const month = getMonth(current_date) + 1;
    const week = getWeek(current_date);

    console.log(year, month, week);

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

      if(!student_lesson.isStudentPaid){
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
            week: week
          }
        });
      }
    });

    return RequestResponse.success();
  } catch (error) {
    console.error("Error in confirmLessonAndRegisterDebt()", error);
    return RequestResponse.error();
  }
}