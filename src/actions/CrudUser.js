"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { RequestResponse } from "@/utils/requestResponse";

/**
 * Creates a new user in the database after validating and normalizing the input data.
 *
 * This function checks for required fields, validates email and phone number formats,
 * ensures the uniqueness of both institutional and personal email addresses, hashes
 * the password, and stores the normalized user information in the database.
 *
 * @async
 * @function createNewUser
 * @param {Object} prev_state - The previous state (not used in this function, but may be required for framework compatibility).
 * @param {Object} form_dada - The user data submitted from the form.
 * @param {string} form_dada.firstName - The user's first name (required).
 * @param {string} form_dada.lastName - The user's last name (required).
 * @param {string} form_dada.email - The institutional email address (must be unique and valid).
 * @param {string} form_dada.personalEmail - The personal email address (must be unique and valid).
 * @param {string} form_dada.phoneNumber - The user's phone number (must be numeric and at least 9 digits).
 * @param {string} form_dada.city - The city where the user resides (required).
 * @param {string} form_dada.country - The user's country (required).
 * @param {string} form_dada.role - The role assigned to the user (e.g., 'student', 'teacher') (required).
 * @param {string} form_dada.password - The user's password (required and will be hashed before storage).
 *
 * @returns {Promise<Object>} An object representing the result of the operation:
 * - If successful: `{ success: true, data: user }`
 * - If failed: `{ success: false, message: string }`
 *
 * @throws {Error} If any unexpected error occurs during the process.
 */
export async function createNewUser(prev_state, form_dada) {
  try {
    const {
      firstName,
      lastName,
      email,
      personalEmail,
      phoneNumber,
      city,
      country,
      role,
      password,
    } = form_dada;

    // Validación de campos obligatorios
    if (
      !firstName ||
      !lastName ||
      !email ||
      !personalEmail ||
      !phoneNumber ||
      !city ||
      !country ||
      !role ||
      !password
    ) {
      return RequestResponse.error("Por favor introduzca todos los datos");
    }

    // Validación de número de teléfono
    if (phoneNumber.length < 9 || !/^[0-9]+$/.test(phoneNumber)) {
      return RequestResponse.error(
        "Por favor introduzca un número de teléfono válido"
      );
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || !emailRegex.test(personalEmail)) {
      return RequestResponse.error("Introduzca correos válidos");
    }

    // Normalización de datos
    const normalized_data = Object.fromEntries(
      Object.entries(form_dada).map(([key, value]) =>
        key !== "password"
          ? [
              key,
              typeof value === "string" ? value.trim().toLowerCase() : value,
            ]
          : [key, value]
      )
    );

    // Verificar duplicados
    const existingEmail = await prisma.user.findFirst({
      where: { email },
    });
    if (existingEmail) {
      return RequestResponse.error(
        `El correo institucional "${email}" ya está registrado.`
      );
    }

    const existingPersonalEmail = await prisma.user.findFirst({
      where: { personalEmail },
    });
    if (existingPersonalEmail) {
      return RequestResponse.error(
        `El correo personal "${personalEmail}" ya está registrado.`
      );
    }

    // Construcción de nombres
    const short_name =
      firstName.trim().split(" ")[0] + " " + lastName.trim().split(" ")[0];
    const full_name = firstName.trim() + " " + lastName.trim();

    // Encriptar contraseña y normalizar
    normalized_data.password = await bcrypt.hash(normalized_data.password, 10);
    normalized_data.role = [normalized_data.role];
    normalized_data.shortName = short_name;
    normalized_data.fullName = full_name;

    // Crear usuario
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

/**
 * Updates an existing user in the database with the provided form data.
 *
 * This function performs validations on required fields, checks for valid formats
 * (such as phone number and email), ensures that the `personalEmail` is unique
 * across other users, optionally updates the password if requested, and saves the
 * normalized data to the database.
 *
 * @async
 * @function updateUser
 * @param {Object} prev_state - The previous state (not used directly, reserved for framework compatibility).
 * @param {Object} form_dada - The updated user data.
 * @param {string} form_dada.idUser - The user ID to update (required).
 * @param {string} form_dada.firstName - The user's first name (required).
 * @param {string} form_dada.lastName - The user's last name (required).
 * @param {string} form_dada.email - The institutional email address (must be valid).
 * @param {string} form_dada.personalEmail - The user's personal email (must be valid and unique across users).
 * @param {string} form_dada.phoneNumber - The user's phone number (must be numeric and at least 9 digits).
 * @param {string} form_dada.city - The city where the user resides (required).
 * @param {string} form_dada.country - The user's country (required).
 * @param {string} form_dada.role - The role assigned to the user (required).
 * @param {string} [form_dada.password] - The new password (optional; required only if `isChangePassword` is true).
 * @param {boolean} [form_dada.isChangePassword] - Whether to hash and update the password.
 *
 * @returns {Promise<Object>} An object representing the result of the operation:
 * - If successful: `{ success: true }`
 * - If failed: `{ success: false, message: string }`
 *
 * @throws {Error} If any unexpected error occurs during the process.
 */
export async function updateUser(prev_state, form_dada) {
  try {
    const {
      idUser,
      firstName,
      lastName,
      email,
      personalEmail,
      phoneNumber,
      city,
      country,
      role,
      password,
      isChangePassword,
    } = form_dada;

    // Validar campos obligatorios
    if (
      !firstName ||
      !lastName ||
      !email ||
      !personalEmail ||
      !phoneNumber ||
      !city ||
      !country ||
      !role
    ) {
      return RequestResponse.error("Por favor introduzca todos los datos");
    }

    // Validar formato del número de teléfono
    if (phoneNumber.length < 9 || !/^[0-9]+$/.test(phoneNumber)) {
      return RequestResponse.error(
        "Por favor introduzca un número de teléfono válido"
      );
    }

    // Validar formato de correos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || !emailRegex.test(personalEmail)) {
      return RequestResponse.error("Introduzca correos válidos");
    }

    // Verificar que el ID del usuario esté presente
    if (!idUser) {
      throw new Error("Error: ID de usuario no proporcionado");
    }

    // Validar longitud de la nueva contraseña si se cambia
    if (password && password.length < 6) {
      return RequestResponse.error(
        "La contraseña debe tener al menos 6 caracteres"
      );
    }

    // Normalizar datos (minúsculas y espacios)
    const normalized_data = Object.fromEntries(
      Object.entries(form_dada).map(([key, value]) =>
        key !== "password"
          ? [
              key,
              typeof value === "string" ? value.trim().toLowerCase() : value,
            ]
          : [key, value]
      )
    );

    // Verificar que el usuario exista
    const exist_user = await prisma.user.findFirst({
      where: {
        id: parseInt(idUser),
      },
      select: {
        id: true,
      },
    });

    if (!exist_user) {
      return RequestResponse.error("El usuario no existe.");
    }

    // Verificar que el correo personal no esté en uso por otro usuario
    const personalEmailExists = await prisma.user.findFirst({
      where: {
        personalEmail: normalized_data.personalEmail,
        NOT: { id: parseInt(idUser) },
      },
      select: { id: true },
    });

    if (personalEmailExists) {
      return RequestResponse.error(
        "El correo personal ya está registrado por otro usuario."
      );
    }

    // Verificar que el correo institucional no esté en uso por otro usuario
    const emailExists = await prisma.user.findFirst({
      where: {
        email: normalized_data.email,
        NOT: { id: parseInt(idUser) },
      },
      select: { id: true },
    });

    if (emailExists) {
      return RequestResponse.error(
        "El correo institucional ya está registrado por otro usuario."
      );
    }

    // Construir nombre corto y completo
    const short_name =
      firstName.trim().split(" ")[0] + " " + lastName.trim().split(" ")[0];
    const full_name = firstName.trim() + " " + lastName.trim();

    // Encriptar contraseña si se indica cambio
    if (password && password.length > 5 && isChangePassword) {
      normalized_data.password = await bcrypt.hash(password, 10);
    } else {
      delete normalized_data.password;
    }

    delete normalized_data.isChangePassword;
    delete normalized_data.idUser;

    // Normalizar rol como array
    normalized_data.role = [normalized_data.role];

    // Agregar nombres
    normalized_data.shortName = short_name;
    normalized_data.fullName = full_name;

    // Actualizar en base de datos
    await prisma.user.update({
      where: {
        id: exist_user.id,
      },
      data: {
        ...normalized_data,
      },
    });

    return RequestResponse.success();
  } catch (error) {
    console.error("Error updateUser():", error);
    return RequestResponse.error();
  }
}

/**
 * Fetches a list of all users with specific fields and ordering.
 *
 * This function retrieves a list of all users from the database using Prisma ORM.
 * It selects specific fields such as `id`, `firstName`, `lastName`, `fullName`, `shortName`,
 * `email`, `role`, `averageScore`, and `isActive`. The users are ordered alphabetically
 * by their `firstName` in ascending order.
 *
 * @async
 * @function getAllUsers
 * @returns {Promise<Object>} A promise that resolves to an object containing the following:
 * @property {Array<Object>} data - An array of user objects, each containing the following properties:
 * @property {string} data.id - The unique identifier of the user.
 * @property {string} data.firstName - The first name of the user.
 * @property {string} data.lastName - The last name of the user.
 * @property {string} data.fullName - The full name of the user (combination of `firstName` and `lastName`).
 * @property {string} data.shortName - A shortened version of the user's name.
 * @property {string} data.email - The email address of the user.
 * @property {Array<string>} data.role - An array of roles assigned to the user (e.g., "teacher", "student").
 * @property {number} data.averageScore - The average score of the user (if applicable).
 * @property {boolean} data.isActive - Indicates whether the user account is active.
 *
 * @throws {Error} If there is an error during the database query or processing, it logs the error and returns an error response.
 *
 * @example
 * const users = await getAllUsers();
 * console.log(users);
 * // Output might look like:
 * // [
 * //   {
 * //     id: "1",
 * //     firstName: "John",
 * //     lastName: "Doe",
 * //     fullName: "John Doe",
 * //     shortName: "J. Doe",
 * //     email: "john.doe@example.com",
 * //     role: ["student"],
 * //     averageScore: 85,
 * //     isActive: true
 * //   },
 * //   {
 * //     id: "2",
 * //     firstName: "Jane",
 * //     lastName: "Smith",
 * //     fullName: "Jane Smith",
 * //     shortName: "J. Smith",
 * //     email: "jane.smith@example.com",
 * //     role: ["teacher"],
 * //     averageScore: null,
 * //     isActive: true
 * //   }
 * // ]
 */
export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        fullName: true,
        shortName: true,
        email: true,
        role: true,
        averageScore: true,
        isActive: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });
    return RequestResponse.success(users);
  } catch (error) {
    console.error("Error in getAllUsers()", error);
    return RequestResponse.error();
  }
}
//TODO: Use in InputSearh in filter Calendar
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

export async function getUserById(id_user) {
  try {
    let id = parseInt(id_user, 10);
    if (isNaN(id)) {
      return RequestResponse.error();
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        fullName: true,
        shortName: true,
        email: true,
        personalEmail: true,
        role: true,
        averageScore: true,
        phoneNumber: true,
        city: true,
        country: true,
        isActive: true,
      },
    });
    if (!user) {
      return RequestResponse.error();
    }
    return RequestResponse.success(user);
  } catch (error) {
    console.error("Error in getUserById", error);
    return RequestResponse.error();
  }
}

export async function deactivateUser(id_user) {
  try {
    let id = parseInt(id_user, 10);
    if (isNaN(id)) {
      throw new Error("Invalid id user");
    }
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
    return RequestResponse.success();
  } catch (error) {
    console.error("Error in deactivateUser()", error);
    return RequestResponse.error();
  }
}

export async function activateUser(id_user) {
  try {
    let id = parseInt(id_user, 10);
    if (isNaN(id)) {
      throw new Error("Invalid id user");
    }
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
    });
    return RequestResponse.success();
  } catch (error) {
    console.error("Error in activateUser()", error);
    return RequestResponse.error();
  }
}

export async function getIsActiveUser(id_user) {
  try {
    let id = parseInt(id_user, 10);
    if (isNaN(id)) {
      throw new Error("Invalid id user");
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        isActive: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return RequestResponse.success(user);
  } catch (error) {
    console.error("Error in getIsActiveUser()", error);
    return RequestResponse.error();
  }
}
