import moment from "moment";

export function FormattedDate(originalDate) {
  const date = new Date(originalDate);

  // Formatear la fecha a 'YYYY-MM-DD HH:MM'
  const formatted_date =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0") +
    " " +
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0");

  return moment(formatted_date).toDate();
}
