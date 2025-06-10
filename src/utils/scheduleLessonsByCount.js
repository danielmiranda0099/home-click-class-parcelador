import moment from "moment";
import { DAYS_OF_WEEK_NUMBER } from "./constans";

/**
 * Generates scheduled lesson dates based on number of classes and specified days/hours.
 *
 * @param {string[]} selected_days - ["LU", "MA", "MI", "JU", "VI", "SA", "DO"]
 * @param {Object.<number, string>} times - { 1: "08:00", 3: "10:00" }
 * @param {string} startDate - Start date in "YYYY-MM-DD" format.
 * @param {{numbers: number, hour: string}} numberOfClasses - Class count and default hour.
 * @returns {{ data: string[] }}
 */
export function scheduleLessonsByCount(
  selected_days,
  times,
  startDate,
  numberOfClasses
) {
  try {
    const totalClasses = parseInt(numberOfClasses.numbers, 10);
    if (isNaN(totalClasses) || totalClasses <= 0) {
      console.error("El número de clases debe ser mayor a 0.");
      return {
        data: null,
      };
    }

    const dates = [];

    if (totalClasses === 1) {
      const dateTime = moment(startDate)
        .hour(numberOfClasses.hour.split(":")[0])
        .minute(numberOfClasses.hour.split(":")[1]);

      return {
        data: [new Date(dateTime.format()).toISOString()],
        
      };
    }

    const selectedDaysNumbers = selected_days.map(
      (day) => DAYS_OF_WEEK_NUMBER[day]
    );

    if (selectedDaysNumbers.length === 0) {
      console.error(
        "Debes seleccionar al menos un día para agendar múltiples clases."
      );
      return {
        data: null,
      };
    }

    let currentDate = moment(startDate);

    while (dates.length < totalClasses) {
      const currentDay = currentDate.day();

      if (selectedDaysNumbers.includes(currentDay) && times[currentDay]) {
        const time = times[currentDay].split(":");
        const scheduled = currentDate.clone().hour(time[0]).minute(time[1]);
        dates.push(new Date(scheduled.format()).toISOString());
      }

      currentDate.add(1, "day");

      // Evita loops infinitos
      if (
        dates.length === 0 &&
        currentDate.diff(moment(startDate), "days") > 30
      ) {
        console.error("No se pudo encontrar días válidos para agendar clases.");
        return {
          data: null,
        };
      }
    }

    return {
      data: dates,
    };
  } catch (error) {
    console.error("Error en scheduleLessonsByCount", error);
    return {
      data: null,
    };
  }
}
