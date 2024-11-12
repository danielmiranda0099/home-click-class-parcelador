"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { RequestResponse } from "@/utils/requestResponse";

export async function createNewUser(prev_state, form_dada) {
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
      return RequestResponse.error("Porfavor introdusca todos los datos");
    }
    if (phoneNumber.length < 9 || !/^[0-9]+$/.test(phoneNumber)) {
      return RequestResponse.error(
        "Porfavor introdusca un numero de telefono valido"
      );
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
      return RequestResponse.error("El usuario ya esta registrado.");
    }

    normalized_data.password = await bcrypt.hash(normalized_data.password, 10);
    normalized_data.role = [normalized_data.role];

    const user = await prisma.user.create({
      data: {
        ...normalized_data,
      },
    });
    return RequestResponse.success(user);
  } catch (error) {
    console.error("Error Creating User:", error);
    return RequestResponse.error();
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

export async function getUserSession() {
  try {
    const session = await auth();
    return RequestResponse.success(session);
  } catch (error) {
    console.error("Error GetUserSession:", error);
    return RequestResponse.error();
  }
}
