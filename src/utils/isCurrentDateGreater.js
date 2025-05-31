import { FormattedDate } from "./formattedDate";

export function isCurrentDateGreater(providedDate) {
  if (!providedDate) return false;
  const providedDateStr = FormattedDate(providedDate);
  const new_date = new Date(providedDateStr.replace(" ", "T"));

  const currentDate = new Date();

  return currentDate > new_date;
}
