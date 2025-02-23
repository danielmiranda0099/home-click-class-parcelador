"use server";

import prisma from "@/lib/prisma";
import { DAYS_OF_WEEK_FULL } from "@/utils/constans";
import { RequestResponse } from "@/utils/requestResponse";

/** @namespace ScheduleTypes */

/**
 * @typedef {Object} ScheduleTypes.ScheduleDay
 * @property {number} day Day of the week (0-6, where 0 represents Sunday)
 * @property {string[]} hours Array of hours in ISO UTC format (e.g., ["2024-02-21T10:00:00Z"])
 */

/**
 * @typedef {Object} ScheduleTypes.UpdateScheduleData
 * @property {string} userId Unique identifier of the user
 * @property {ScheduleTypes.ScheduleDay[]} scheduleData Array of schedule configurations for different days
 */

/**
 * @typedef {Object} ScheduleTypes.UpdateScheduleResponse
 * @property {boolean} success Indicates if the operation was successful
 * @property {string} [message] Optional message providing additional information about the operation
 */

/**
 * Updates a user's schedule with validation and atomic operations.
 *
 * @param {any} prevState Previous form state (unused)
 * @param {ScheduleTypes.UpdateScheduleData} data Schedule update configuration
 * @returns {Promise<ScheduleTypes.UpdateScheduleResponse>} Result of the schedule update operation
 *
 * @example
 * const data = {
 *   userId: "user123",
 *   scheduleData: [{
 *     day: 1,
 *     hours: ["2024-02-21T10:00:00Z"]
 *   }]
 * };
 *
 * try {
 *   const result = await updateSchedule(null, data);
 *   console.log(result); // { success: true }
 * } catch (error) {
 *   console.error(error);
 * }
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
            `Las horas deben tener intervalos exactos de 1 hora en el dia ${DAYS_OF_WEEK_FULL[dayData.day]}`
          );
        }

        // Verificar solapamientos
        const minutes = hour * 60 + minute;
        for (const existingMinutes of hourSet) {
          if (Math.abs(existingMinutes - minutes) < 60) {
            return RequestResponse.error(
              `Hay una hora repetida el dia ${DAYS_OF_WEEK_FULL[dayData.day]}`
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

export async function getUserSheduleById(userId) {
  try {
    const userSchedule = await prisma.schedule.findMany({
      where: {
        userId: userId,
      },
      select: {
        day: true,
        hours: true,
      },
      
    });

    const sortedUserSchedule = userSchedule.map(schedule => ({
      ...schedule,
      hours: schedule.hours.sort((a, b) => a.getTime() - b.getTime())
    }));
    console.log("🚀 ~ getUserSheduleById ~ userSchedule:", userSchedule)

    return RequestResponse.success(sortedUserSchedule);
  } catch (error) {
    console.error("Error in getSheduleById()", error);
    return RequestResponse.error();
  }
}