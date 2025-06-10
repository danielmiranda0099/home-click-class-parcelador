import moment from "moment";
import { DAYS_OF_WEEK_NUMBER } from "./constans";

/**
 * Generates an array of scheduled lesson dates based on selected days, times, and a specific period.
 *
 * @param {string[]} selected_days - Selected days represented by their initials in Spanish. Possible values: ["LU", "MA", "MI", "JU", "VI", "SA", "DO"].
 * @param {Object.<number, string>} times - Object that defines the time for each day of the week. The key is a number from 0 (Sunday) to 6 (Saturday), and the value is the time in "HH:mm" format.
 * @param {string} period - Time period for generating dates. Possible values: "3M" (3 months), "6M" (6 months), "1Y" (1 year).
 * @param {string} startDate - Start date in "YYYY-MM-DD" format.
 * @returns {string[]} Array of scheduled lesson dates in ISO format.
 */
export function scheduleLessonsByPeriod(selected_days, times, period, startDate) {
  try {
    const dates = [];
    let currentDate = moment(startDate); // Iniciar desde la fecha proporcionada
    let endDate;
    const selected_days_of_week_number = selected_days.map(
      (day) => DAYS_OF_WEEK_NUMBER[day]
    );
    // Configurar el tiempo final según el parámetro 'period'
    switch (period) {
      case "3M": // 3 meses
        endDate = moment(startDate).add(3, "months");
        break;
      case "6M": // 6 meses
        endDate = moment(startDate).add(6, "months");
        break;
      case "1Y": // 1 año
        endDate = moment(startDate).add(1, "year");
        break;
      default:
        console.error("Período no válido");
        return [];
    }

    while (currentDate.isSameOrBefore(endDate)) {
      if (selected_days_of_week_number.includes(currentDate.day())) {
        const dateWithTime = currentDate
          .clone()
          .hour(times[currentDate.day()].split(":")[0])
          .minute(times[currentDate.day()].split(":")[1]);

        dates.push(new Date(dateWithTime.format()).toISOString());
      }
      currentDate.add(1, "days"); // Avanzar al siguiente día
    }

    return {
      data: dates,
      succes: true,
    };
  } catch (error) {
    console.error("Error in scheduleLessons", error);
    return {
      data: null,
      succes: false,
      message: "Ups!, Lo sentimos ocurrio un error inesperado.",
    };
  }
}
