import moment from "moment";

export function FormattedDate(originalDate, addHour = false) {
  // Formatear la fecha en el formato requerido
  const formatted_date = moment(originalDate).format("YYYY-MM-DD HH:mm");

  // Crear un objeto moment a partir de la fecha formateada
  const date = moment(formatted_date, "YYYY-MM-DD HH:mm");

  // Sumar una hora si addHour es true
  if (addHour) {
    date.add(1, "hour");
  }

  // Devolver la nueva fecha en el formato deseado
  return date.format("YYYY-MM-DD HH:mm");
}
