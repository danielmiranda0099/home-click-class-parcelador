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
          ? [key, typeof value === "string" ? value.trim().toLowerCase() : value]
          : [key, value]
      )
    );
    console.log("normalized_data *****************", normalized_data);
    const exist_user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (exist_user) {
      return RequestResponse.error(`El correo "${email}" ya esta registrado.`);
    }

    const short_name = firstName.trim().split(" ")[0] + " " + lastName.trim().split(" ")[0];
    const full_name = firstName.trim() + " " + lastName.trim();

    normalized_data.password = await bcrypt.hash(normalized_data.password, 10);
    normalized_data.role = [normalized_data.role];

    normalized_data.shortName = short_name;
    normalized_data.fullName = full_name;

    console.log("normalized_data *****************", normalized_data);
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

export async function updateUser(prev_state, form_dada) {
  try {
    const {
      idUser,
      firstName,
      lastName,
      email,
      phoneNumber,
      city,
      country,
      role,
      password,
      isChangePassword,
    } = form_dada;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !city ||
      !country ||
      !role
    ) {
      return RequestResponse.error("Porfavor introdusca todos los datos");
    }

    if (phoneNumber.length < 9 || !/^[0-9]+$/.test(phoneNumber)) {
      return RequestResponse.error(
        "Porfavor introdusca un numero de telefono valido"
      );
    }

    if (!idUser) {
      throw new Error("Error in label !idUser");
    }

    if (password && password.length < 5) {
      return RequestResponse.error(
        "La contraseña debe tener al menos 6 caracteres"
      );
    }

    const normalized_data = Object.fromEntries(
      Object.entries(form_dada).map(([key, value]) =>
        key !== "password"
          ? [key, typeof value === "string" ? value.trim().toLowerCase() : value]
          : [key, value]
      )
    );

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

    const short_name = firstName.trim().split(" ")[0] + " " + lastName.trim().split(" ")[0];
    const full_name = firstName.trim() + " " + lastName.trim();

    if (password && password.length > 5 && isChangePassword) {
      normalized_data.password = await bcrypt.hash(
        normalized_data.password,
        10
      );
    } else {
      delete normalized_data.password;
    }
    delete normalized_data.isChangePassword;

    if (normalized_data.idUser) {
      delete normalized_data.idUser;
    }

    normalized_data.role = [normalized_data.role];

    normalized_data.shortName = short_name;
    normalized_data.fullName = full_name;

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
