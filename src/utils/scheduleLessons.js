import moment from "moment";
import { DAYS_OF_WEEK_NUMBER } from "./constans";

export function scheduleLessons(selected_days, times, period, startDate) {
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

  return dates;
}
