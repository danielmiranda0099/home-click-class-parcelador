import { startOfWeek, endOfWeek, setISOWeek, format } from "date-fns";

/**
 * Gets the date range for a given ISO week number and year.
 * @param {number} weekNumber - The ISO week number (1 to 52/53).
 * @param {number} year - The year.
 * @returns {string} - The date range in the format "DD-MM-YY / DD-MM-YY".
 */
export function getWeekDateRange(weekNumber, year) {
  // Ensure the week number is valid (1-53)
  if (weekNumber < 1 || weekNumber > 53) {
    throw new Error("Week number must be between 1 and 53.");
  }

  const firstDayOfWeek = startOfWeek(
    setISOWeek(new Date(year, 0, 1), weekNumber),
    {
      weekStartsOn: 1,
    }
  );
  const lastDayOfWeek = endOfWeek(firstDayOfWeek, {
    weekStartsOn: 1,
  });

  const formattedStart = format(firstDayOfWeek, "dd-MM-yy");
  const formattedEnd = format(lastDayOfWeek, "dd-MM-yy");

  return `${formattedStart} / ${formattedEnd}`;
}
