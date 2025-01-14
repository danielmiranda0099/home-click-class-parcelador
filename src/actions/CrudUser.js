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

    const short_name = firstName.split(" ")[0] + " " + lastName.split(" ")[0];
    const full_name = firstName + " " + lastName;

    normalized_data.password = await bcrypt.hash(normalized_data.password, 10);
    normalized_data.role = [normalized_data.role];

    normalized_data.shortName = short_name;
    normalized_data.fullName = full_name;

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
          ? [key, typeof value === "string" ? value.toLowerCase() : value]
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

    const short_name = firstName.split(" ")[0] + " " + lastName.split(" ")[0];
    const full_name = firstName + " " + lastName;

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

//TODO: Refact
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
      },
    });
    return users;
  } catch (error) {
    console.error("Error Get All Users:", error);
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
