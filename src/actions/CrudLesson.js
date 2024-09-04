"use server";

import { supabase } from "@/utils/supabase";

const formattedLessonForBD = (form_dada) => {
  // TODO Mirar como adtener los de mas datos del formulario
  const lesson_formated = Object.fromEntries(form_dada.entries());
  lesson_formated.is_group = Boolean(lesson_formated.is_group);
  if (lesson_formated.teacher_payment)
    parseInt(lesson_formated.teacher_payment, 10);
  console.log("Formated lesson", lesson_formated);
  return lesson_formated;
};

export async function CreateNewLesson(form_dada) {
  const lesson_formated = formattedLessonForBD(form_dada);
  const { data, error } = await supabase
    .from("lesson")
    .insert([lesson_formated])
    .select();
  if (error) console.error("Error adding item:", error);

  console.log(data);
  return data;
}

export async function GetLessons() {
  const { data, error } = await supabase.from("lesson").select("*");
  console.log(data);
  if (error) {
    console.log("error database", error);
    return [];
  }

  return data;
}

export async function UpdateLesson(id, updated_lesson) {
  const formated_lesson = formattedLessonForBD(updated_lesson);
  const { data, error } = await supabase
    .from("lesson")
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
    .from("lesson")
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
    .from("lesson")
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
    .from("lesson")
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
    .from("lesson")
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
    .from("lesson")
    .update({ is_teacher_paid: true })
    .eq("id", id);
  console.log(data);
  if (error) {
    console.log("error database", error);
    return [];
  }
  console.log("Paid Tecaher Lesson", data);
}
