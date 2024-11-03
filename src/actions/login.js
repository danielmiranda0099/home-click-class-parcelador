"use server";

import { signIn } from "@/auth";

export async function login(prevState, formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return {
        error: "El correo electrónico y la contraseña son obligatorios",
      };
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error en el inicio de sesión", error);
    return { error: "Ocurrió un error inesperado" };
  }
}
