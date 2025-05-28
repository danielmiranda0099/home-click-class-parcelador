"use server";

import prisma from "@/lib/prisma";
import { DAYS_OF_WEEK_FULL } from "@/utils/constans";
import { RequestResponse } from "@/utils/requestResponse";

/**
 * Validates and formats schedule data for a user.
 *
 * @async
 * @function validateScheduleData
 * @param {Object} prevState - The previous state (unused in this function).
 * @param {Object} data - The input data containing user ID and schedule details.
 * @param {string} data.userId - The ID of the user.
 * @param {Array} data.scheduleData - An array of schedule objects.
 * @param {number} data.scheduleData[].day - The day of the week (0-6, where 0 is Sunday).
 * @param {string[]} data.scheduleData[].hours - An array of ISO 8601 UTC timestamps (e.g., "2024-02-27T10:00:00.000Z").
 * @returns {Promise<Object>} A response object containing validation results.
 *
 * @throws {Error} If an unexpected error occurs during validation.
 *
 * @example
 * const data = {
 *   userId: "123",
 *   scheduleData: [
 *     { day: 1, hours: ["2024-02-27T10:00:00.000Z", "2024-02-27T11:30:00.000Z"] }
 *   ]
 * };
 * const response = await validateScheduleData(null, data);
 * console.log(response);
 */
export async function validateScheduleData(prevState, data) {
  try {
    if (!Array.isArray(data)) {
      return RequestResponse.error("Invalid schedule data format 0");
    }

    const formattedSchedules = [];
    const errorMessages = [];

    // Procesar cada usuario individualmente
    for (const userSchedule of data) {
      const { userId, scheduleData } = userSchedule;

      const userExists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, shortName: true },
      });

      if (!userExists) {
        return RequestResponse.error(`User not found: ${userId}`);
      }

      if (!Array.isArray(scheduleData)) {
        return RequestResponse.error(
          `Invalid schedule data for user: ${userExists.shortName}`
        );
      }

      const formattedSchedule = [];
      const daySet = new Set();
      // Set para almacenar los días con horarios duplicados o solapados (por usuario)
      let daysWithError = new Set();

      for (const dayData of scheduleData) {
        if (
          typeof dayData.day !== "number" ||
          dayData.day < 0 ||
          dayData.day > 6
        ) {
          return RequestResponse.error(
            `Invalid day: ${dayData.day} for user ${userExists.shortName}`
          );
        }

        if (daySet.has(dayData.day)) {
          return RequestResponse.error(
            `Day duplicated in request: ${dayData.day}`
          );
        }
        daySet.add(dayData.day);

        const hours = Array.isArray(dayData.hours) ? dayData.hours : [];
        // Nueva colección para almacenar las horas procesadas en este día
        const hourSet = new Set();

        for (const hourStr of hours) {
          if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(hourStr)) {
            return RequestResponse.error(`Invalid hour: ${hourStr}`);
          }

          const date = new Date(hourStr);
          const timeInMinutes = date.getUTCHours() * 60 + date.getUTCMinutes();

          // Verificar si existe alguna hora en el mismo día que esté a menos de 60 minutos de diferencia
          for (const existingTime of hourSet) {
            const timeDifference = Math.abs(existingTime - timeInMinutes);
            if (timeDifference < 60) {
              daysWithError.add(DAYS_OF_WEEK_FULL[dayData.day]);
            }
          }
          hourSet.add(timeInMinutes);
        }

        formattedSchedule.push({ userId, day: dayData.day, hours });
      }

      formattedSchedules.push({ userId, formattedSchedule });

      // Si se detectaron solapamientos para este usuario, se agrega el mensaje de error
      if (daysWithError.size > 0) {
        errorMessages.push(
          `Problema en horario del usuario ${userExists.shortName} en los días ${[...daysWithError].join(", ")}.`
        );
      }
    }

    return RequestResponse.success({
      data: formattedSchedules,
      isValid: errorMessages.length === 0,
      message: errorMessages.join("/%*%/"),
    });
  } catch (error) {
    console.error("Error in validateScheduleData()", error);
    return RequestResponse.error();
  }
}

/**
 * Updates the schedule for a user by replacing the existing schedule with a new one.
 *
 * @async
 * @function updateSchedule
 * @param {Object} prevState - The previous state (unused in this function).
 * @param {Object} data - The input data containing user ID and the formatted schedule.
 * @param {string} data.userId - The ID of the user.
 * @param {Array} data.formattedSchedule - An array of schedule objects to be saved.
 * @returns {Promise<Object>} A success response if the transaction completes successfully.
 *
 * @throws {Error} If an error occurs during the database transaction.
 *
 * @example
 * const data = {
 *   userId: "123",
 *   formattedSchedule: [{ userId: "123", day: 1, hours: ["2024-02-27T10:00:00.000Z"] }]
 * };
 * const response = await updateSchedule(null, data);
 * console.log(response);
 */
export async function updateSchedule(prevState, data) {
  try {
    if (!Array.isArray(data)) {
      return RequestResponse.error("Invalid schedule data format 1");
    }

    console.log("data ************************", JSON.stringify(data, null, 2))
    await prisma.$transaction(async (tx) => {
      for (const userSchedule of data) {
        const { userId, formattedSchedule } = userSchedule;

        await tx.schedule.deleteMany({ where: { userId } });
        await tx.schedule.createMany({ data: formattedSchedule });
      }
    });

    return RequestResponse.success();
  } catch (error) {
    console.error("Error in updateSchedule()", error);
    return RequestResponse.error();
  }
}

/**
 * Retrieves the user's schedule by their ID, sorting the hours for each scheduled day.
 *
 * @async
 * @function getUserScheduleById
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} A response object containing the user's sorted schedule.
 *
 * @throws {Error} If an error occurs while fetching the schedule from the database.
 *
 * @example
 * const response = await getUserScheduleById("123");
 * console.log(response);
 */
export async function getUserScheduleById(id) {
  try {
    const userId = parseInt(id);
    const userSchedule = await prisma.schedule.findMany({
      where: {
        userId: userId,
      },
      select: {
        day: true,
        hours: true,
      },
    });

    const sortedUserSchedule = userSchedule.map((schedule) => ({
      ...schedule,
      hours: schedule.hours.sort((a, b) => a.getTime() - b.getTime()),
    }));

    return RequestResponse.success(sortedUserSchedule);
  } catch (error) {
    console.error("Error in getSheduleById()", error);
    return RequestResponse.error();
  }
}
