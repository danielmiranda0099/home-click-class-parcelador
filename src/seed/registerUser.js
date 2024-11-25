// scripts/seed.js

import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  const adminEmail = "daniel@gmail.com"; // Cambia a tu email preferido para el admin
  const adminPassword = "admin"; // Cambia a tu contraseña preferida

  // Verifica si ya existe un administrador
  const existingAdmin = await prisma.user.findFirst({
    where: {
      email: adminEmail,
    },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        firstName: "daniel",
        lastName: "miranda",
        shortName: "daniel miranda",
        fullName: "daniel miranda castillo",
        email: adminEmail,
        phoneNumber: "123456789",
        city: "santa marta",
        country: "colombia",
        password: hashedPassword,
        role: ["admin"],
      },
    });
    console.log("SEED OK -------------> Usuario admin creado con éxito");
  } else {
    console.log("El usuario admin ya existe.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
