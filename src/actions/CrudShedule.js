"use server";

import prisma from "@/lib/prisma";
import { RequestResponse } from "@/utils/requestResponse";

/**
 * @typedef {Object} ScheduleDay
 * @property {number} day - Número del día (0-6, 0=Domingo)
 * @property {string[]} hours - Array de horas en formato ISO UTC
 */

/**
 * Actualiza el horario de un usuario con validaciones y operaciones atómicas
 * @param {any} prevState - Estado previo del formulario (no usado)
 * @param {number} userId - ID del usuario
 * @param {ScheduleDay[]} scheduleData - Datos del horario
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function updateSchedule(prevState, data) {
  try {
    const { userId, scheduleData } = data;

    // Validar existencia del usuario
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      return RequestResponse.error("User not found");
    }

    // Validar estructura de datos
    if (!Array.isArray(scheduleData)) {
      return RequestResponse.error("Invalid schedule data");
    }

    // Formatear y validar el horario
    const formattedSchedule = [];
    const daySet = new Set();

    for (const dayData of scheduleData) {
      // Validar día
      if (
        typeof dayData.day !== "number" ||
        dayData.day < 0 ||
        dayData.day > 6
      ) {
        return RequestResponse.error(`Invalid day: ${dayData.day}`);
      }

      // Validar unicidad de días en el input
      if (daySet.has(dayData.day)) {
        return RequestResponse.error(
          `Day duplicated in request: ${dayData.day}`
        );
      }
      daySet.add(dayData.day);

      // Validar y formatear horas
      const hours = Array.isArray(dayData.hours) ? dayData.hours : [];
      const hourSet = new Set();

      for (const hourStr of hours) {
        // Validar formato ISO UTC
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(hourStr)) {
          return RequestResponse.error(`Invalid hour: ${hourStr}`);
        }

        // Extraer hora y minutos
        const [hour, minute] = hourStr.split("T")[1].split(":").map(Number);

        // Validar que sea en intervalos de 1 hora exacta
        if (minute !== 0) {
          return RequestResponse.error(
            "Hours must be in exact 1-hour intervals"
          );
        }

        // Verificar solapamientos
        const minutes = hour * 60 + minute;
        for (const existingMinutes of hourSet) {
          if (Math.abs(existingMinutes - minutes) < 60) {
            return RequestResponse.error(
              `Schedule conflict: ${hourStr} overlaps with another schedule on the same day`
            );
          }
        }

        hourSet.add(minutes);
      }

      // Agregar día formateado
      formattedSchedule.push({
        userId,
        day: dayData.day,
        hours,
      });
    }

    // Ejecutar transacción atómica
    await prisma.$transaction(async (tx) => {
      // Eliminar horarios existentes del usuario
      await tx.schedule.deleteMany({ where: { userId } });

      // Crear nuevos horarios
      await tx.schedule.createMany({
        data: formattedSchedule,
      });
    });

    return RequestResponse.success();
  } catch (error) {
    console.error("Error in updateSchedule()", error);
    return RequestResponse.error();
  }
}
