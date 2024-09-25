"use server";

import prisma from "@/lib/prisma";

export async function CreateNewUser(form_dada) {
  try {
    await prisma.user.create({
      data: {
        ...form_dada,
      },
    });
  } catch (error) {
    console.error("Error Creating User:", error);
  }
}
