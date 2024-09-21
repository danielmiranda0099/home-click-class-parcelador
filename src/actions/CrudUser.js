"use server";

import { supabase } from "@/utils/supabase";

export async function CreateNewStudent(form_dada) {
  const { data, error } = await supabase
    .from("students")
    .insert(form_dada)
    .select();
  if (error) console.error("Error adding new student:", error);

  console.log(data);
}

export async function CreateNewTeacher(form_dada) {
  const { data, error } = await supabase
    .from("teachers")
    .insert(form_dada)
    .select();
  if (error) console.error("Error adding new teacher:", error);

  console.log(data);
}
