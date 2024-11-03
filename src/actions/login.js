"use server";

import { signIn } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function login(prevState, formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return {
        error: "El correo electrónico y la contraseña son obligatorios",
      };
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return {
        error: "El correo no es valido",
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    const isValidPassword = user
      ? await bcrypt.compare(password, user.password)
      : null;

    if (!user || !isValidPassword) {
      return { error: "Datos Invalidos" };
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: result.error };
    }

    return {
      data: user,
      success: true,
    };
  } catch (error) {
    console.error("Error en el inicio de sesión", error);
    return { error: "Ocurrió un error inesperado" };
  }
}
