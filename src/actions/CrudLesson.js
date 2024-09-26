"use server";

import prisma from "@/lib/prisma";
import { supabase } from "@/utils/supabase";

const formattedLessonForBD = (form_dada) => {
  // TODO Mirar como adtener los de mas datos del formulario
  const lesson_formated = Object.fromEntries(form_dada.entries());
  if (lesson_formated.is_group)
    lesson_formated.is_group = Boolean(lesson_formated.is_group);
  if (lesson_formated.is_student_paid)
    lesson_formated.is_student_paid = Boolean(
      parseInt(lesson_formated.is_student_paid, 10)
    );
  if (lesson_formated.is_teacher_paid)
    lesson_formated.is_teacher_paid = Boolean(
      parseInt(lesson_formated.is_teacher_paid, 10)
    );
  console.log("Formated lesson***", lesson_formated);
  return lesson_formated;
};

export async function CreateNewLesson(form_dada) {
  // const lesson_formated = formattedLessonForBD(form_dada);
  try {
    const new_lessons = await prisma.lesson.createManyAndReturn({
      data: form_dada,
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
    console.log(lessons);
    return lessons;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }
}

export async function UpdateLesson(id, updated_lesson) {
  const formated_lesson = formattedLessonForBD(updated_lesson);
  const { data, error } = await supabase
    .from("lessons")
    .update(formated_lesson)
    .eq("id", id);
  console.log(data);
  if (error) {
    console.log("error database", error);
    return [];
  }
  console.log("Update database", data);
}

export async function CancelLesson(id) {
  const { data, error } = await supabase
    .from("lessons")
    .update({ is_canceled: true })
    .eq("id", id);
  console.log(data);
  if (error) {
    console.log("error database", error);
    return [];
  }
  console.log("Update database", data);
}

export async function RegisterLesson(id) {
  const { data, error } = await supabase
    .from("lessons")
    .update({ is_registered: true })
    .eq("id", id);
  console.log(data);
  if (error) {
    console.log("error database", error);
    return [];
  }
  console.log("Update database", data);
}

export async function ConfirmLesson(data_form) {
  const { id, lesson_score, student_observations } = data_form;
  const { data, error } = await supabase
    .from("lessons")
    .update({ is_confirmed: true, lesson_score, student_observations })
    .eq("id", id);
  console.log(data);
  if (error) {
    console.log("error database", error);
    return [];
  }
  console.log("Update database", data);
}
//TODO ELIMINAR end_dates
export async function RescheduleLesson(data_form) {
  const { id, start_date } = data_form;
  const { data, error } = await supabase
    .from("lessons")
    .update({ start_date, is_rescheduled: true })
    .eq("id", id);
  console.log(data);
  if (error) {
    console.log("error database", error);
    return [];
  }
  console.log("RESCHEDULE Lesson", data);
}

export async function PayTeacher(id) {
  const { data, error } = await supabase
    .from("lessons")
    .update({ is_teacher_paid: true })
    .eq("id", id);
  console.log(data);
  if (error) {
    console.log("error database", error);
    return [];
  }
  console.log("Paid Tecaher Lesson", data);
}
