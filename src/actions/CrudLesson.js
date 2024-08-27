"use server";

import { supabase } from "@/utils/supabase";

const formattedLessonForBD = (lesson) => {
  // TODO Mirar como adtener los de mas datos del formulario
  const event_formated = {
    topic: lesson.get("topic"),
    start_date: lesson.get("start-date"),
    end_date: lesson.get("end-date"),
  };

  return event_formated;
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
