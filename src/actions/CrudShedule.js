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
    const { userId, scheduleData } = data;

    // Validate user existence
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, shortName: true },
    });

    if (!userExists) {
      return RequestResponse.error("User not found");
    }

    // Validate data structure
    if (!Array.isArray(scheduleData)) {
      return RequestResponse.error("Invalid schedule data");
    }

    // Format and validate the schedule
    const formattedSchedule = [];
    const daySet = new Set();
    let days_whith_error = [];
    for (const dayData of scheduleData) {
      // Validate Day
      if (
        typeof dayData.day !== "number" ||
        dayData.day < 0 ||
        dayData.day > 6
      ) {
        return RequestResponse.error(`Invalid day: ${dayData.day}`);
      }

      // Validate uniqueness of days in the input
      if (daySet.has(dayData.day)) {
        return RequestResponse.error(
          `Day duplicated in request: ${dayData.day}`
        );
      }
      daySet.add(dayData.day);

      // Validate and format hours
      const hours = Array.isArray(dayData.hours) ? dayData.hours : [];
      const hourSet = new Set();
      const scheduledTimes = [];

      for (const hourStr of hours) {
        // Validate ISO UTC format
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(hourStr)) {
          return RequestResponse.error(`Invalid hour: ${hourStr}`);
        }

        // Extract hour and minutes
        const date = new Date(hourStr);
        const hour = date.getUTCHours();
        const minute = date.getUTCMinutes();

        // Convert to minutes for easy comparison
        const timeInMinutes = hour * 60 + minute;
        scheduledTimes.push(timeInMinutes);

        // Validate overlaps - check that there are no schedules less than 60 minutes apart
        for (const existingTime of hourSet) {
          const timeDifference = Math.abs(existingTime - timeInMinutes);
          if (timeDifference < 60) {
            days_whith_error.push(DAYS_OF_WEEK_FULL[dayData.day]);
          }
        }

        hourSet.add(timeInMinutes);
      }

      formattedSchedule.push({
        userId,
        day: dayData.day,
        hours,
      });
    }

    let message;
    if (days_whith_error.length > 0) {
      const days_whith_error_formated = [...new Set(days_whith_error)]
      message = `Problema en hoario del usuario ${userExists.shortName} en los días ${days_whith_error_formated.join(", ")}.`;
    }

    return RequestResponse.success({
      data: formattedSchedule,
      isValid: !days_whith_error.length > 0,
      message: message,
    });
  } catch (error) {
    console.error("Error in validateSheduleData()", error);
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
    const { userId, formattedSchedule } = data;
    await prisma.$transaction(async (tx) => {
      await tx.schedule.deleteMany({ where: { userId } });

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

/**
 * Retrieves the user's schedule by their ID, sorting the hours for each scheduled day.
 *
 * @async
 * @function getUserSheduleById
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} A response object containing the user's sorted schedule.
 *
 * @throws {Error} If an error occurs while fetching the schedule from the database.
 *
 * @example
 * const response = await getUserSheduleById("123");
 * console.log(response);
 */
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
