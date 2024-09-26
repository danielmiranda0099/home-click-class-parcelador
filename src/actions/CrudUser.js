"use server";

import prisma from "@/lib/prisma";

export async function CreateNewUser(form_dada) {
  try {
    const user = await prisma.user.create({
      data: {
        ...form_dada,
      },
    });
    return user;
  } catch (error) {
    console.error("Error Creating User:", error);
  }
}

export async function GetAllUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error Get All Users:", error);
  }
}

export async function GetUsersByStudentsAndTeachers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [{ role: "teacher" }, { role: "student" }],
      },
    });
    return users;
  } catch (error) {
    console.error("Error Get User By Student And Teacher:", error);
  }
}
