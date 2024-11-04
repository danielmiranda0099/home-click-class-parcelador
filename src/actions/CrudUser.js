"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function CreateNewUser(prev_state, form_dada) {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      city,
      country,
      role,
      password,
    } = form_dada;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !city ||
      !country ||
      !role ||
      !password
    ) {
      return {
        data: [],
        error: true,
        message: "Porfavor introdusca todos los datos",
      };
    }
    if (phoneNumber.length < 9 || !/^[0-9]+$/.test(phoneNumber)) {
      return {
        data: [],
        error: true,
        message: "Porfavor introdusca un numero telefono valido",
      };
    }
    const normalized_data = Object.fromEntries(
      Object.entries(form_dada).map(([key, value]) =>
        key !== "password"
          ? [key, typeof value === "string" ? value.toLowerCase() : value]
          : [key, value]
      )
    );
    const exist_user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (exist_user) {
      return {
        data: [],
        error: true,
        message: "El usuario ya esta registrado.",
      };
    }

    normalized_data.password = await bcrypt.hash(normalized_data.password, 10);
    normalized_data.role = [normalized_data.role];

    const user = await prisma.user.create({
      data: {
        ...normalized_data,
      },
    });
    console.log(normalized_data);
    return {
      data: user,
      error: false,
      message: null,
    };
  } catch (error) {
    console.error("Error Creating User:", error);
    return {
      data: [],
      error: true,
      message: "Error inesperado, contacte con soporte.",
    };
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
