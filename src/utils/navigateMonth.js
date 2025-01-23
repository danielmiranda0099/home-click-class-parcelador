/**
 * Navigates to the next or previous month, updating the year if necessary.
 *
 * @param {number} month - The current month (0 = January, 11 = December).
 * @param {number} year - The current year.
 * @param {string} direction - The direction to navigate ("NEXT" or "PREV").
 * @returns {{ year: number, month: number }} - An object containing the updated month and year.
 *
 * @example
 * // Navigate to the next month
 * navigateMonth(0, 2025, "next"); // { month: 1, year: 2025 }
 *
 * @example
 * // Navigate to the previous month
 * navigateMonth(0, 2025, "previous"); // { month: 11, year: 2024 }
 *
 * @example
 * // Navigate across years
 * navigateMonth(11, 2025, "next"); // { month: 0, year: 2026 }
 */
export function navigateMonth(month, year, direction) {
  if (direction === "NEXT") {
    month++;
    if (month > 11) {
      // Cambia de año si el mes supera 11
      month = 0; // Reinicia a enero
      year++;
    }
  }
  if (direction === "PREV") {
    month--;
    if (month < 0) {
      // Cambia de año si el mes es menor a 0
      month = 11; // Retrocede a diciembre
      year--;
    }
  }
  return { year, month };
}
