"use server";

import prisma from "@/lib/prisma";
import { supabase } from "@/utils/supabase";

const formattedLessonForBD = (form_data) => {
  // TODO Mirar como adtener los de mas datos del formulario
  const lesson_formated = Object.fromEntries(form_data.entries());
  if (lesson_formated.isGroup)
    lesson_formated.isGroup = Boolean(lesson_formated.isGroup);
  if (lesson_formated.isStudentPaid)
    lesson_formated.isStudentPaid = Boolean(
      parseInt(lesson_formated.isStudentPaid, 10)
    );
  if (lesson_formated.isTeacherPaid)
    lesson_formated.isTeacherPaid = Boolean(
      parseInt(lesson_formated.isTeacherPaid, 10)
    );
  if (lesson_formated.isRegistered)
    lesson_formated.isRegistered = Boolean(lesson_formated.isRegistered);
  if (lesson_formated.teacherPayment)
    lesson_formated.teacherPayment = parseFloat(lesson_formated.teacherPayment);
  if (lesson_formated.studentFee)
    lesson_formated.studentFee = parseFloat(lesson_formated.studentFee);
  console.log("Formated lesson***", lesson_formated);
  return lesson_formated;
};

export async function CreateNewLesson(form_data) {
  // const lesson_formated = formattedLessonForBD(form_data);
  try {
    const new_lessons = await prisma.lesson.createManyAndReturn({
      data: form_data,
      include: {
        student: true,
        teacher: true,
      },
    });

    return new_lessons;
  } catch (error) {
    console.error("Error Crating lessons:", error);
  }
}

export async function GetLessons() {
  try {
    // Obtener todas las lecciones
    const lessons = await prisma.lesson.findMany({
      include: {
        student: true, // Incluir información del estudiante si es necesario
        teacher: true, // Incluir información del profesor si es necesario
      },
    });

    if (!lessons) return [];
    console.log(lessons.slice(0, 3));
    return lessons;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }
}

export async function UpdateLesson(id, updated_lesson) {
  const updated_lesson_formated = formattedLessonForBD(updated_lesson);
  try {
    await prisma.lesson.update({
      where: {
        id,
      },
      data: updated_lesson_formated,
    });
  } catch (error) {
    console.log("Error Updating Lesson", error);
  }
}

export async function CancelLesson(id) {
  const { data, error } = await supabase
    .from("lessons")
    .update({ is_canceled: true })
    .eq("id", id);
  if (error) {
    console.log("error database", error);
    return [];
  }
  console.log("Update database", data);
}

export async function RegisterLesson(id) {
  try {
    await prisma.lesson.update({
      where: {
        id,
      },
      data: {
        isRegistered: true,
      },
    });
  } catch (error) {
    console.error("error database", error);
  }
}

export async function ConfirmLesson(data_form) {
  try {
    const { id, lessonScore, studentObservations } = data_form;
    await prisma.lesson.update({
      where: {
        id,
      },
      data: {
        isConfirmed: true,
        lessonScore,
        studentObservations,
      },
    });
  } catch (error) {
    console.log("Error Confirming Lesson", error);
  }
}

//TODO ELIMINAR end_dates
export async function RescheduleLesson(data_form) {
  try {
    const { id, startDate } = data_form;
    await prisma.lesson.update({
      where: {
        id,
      },
      data: {
        startDate,
        isRescheduled: true,
      },
    });
  } catch (error) {
    console.error("Error Reschedule lessons:", error);
  }
}

export async function PayLesson(ids, data) {
  try {
    await prisma.lesson.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: data,
    });
  } catch (error) {
    console.error("Error Paying To Teacher", error);
  }
}

export async function UnpaidLessons(
  user_id,
  start_date,
  end_date,
  filters = {}
) {
  if (!user_id) return;
  try {
    const unpaid_lessons = await prisma.lesson.findMany({
      where: {
        OR: [
          {
            studentId: user_id,
            isStudentPaid: false,
          },
          {
            teacherId: user_id,
            isTeacherPaid: false,
          },
        ],
        startDate: {
          gte: start_date,
          lte: end_date,
        },
        isCanceled: false,
        ...filters,
      },
      include: {
        student: true,
        teacher: true,
      },
    });
    return unpaid_lessons;
  } catch (error) {
    console.log("Error Getting Unpaid Lessons", error);
  }
}
