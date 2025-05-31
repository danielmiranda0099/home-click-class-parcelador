export function isCurrentDateGreaterOrEqual(providedDateStr) {
  const providedDate = new Date(providedDateStr.replace(" ", "T"));

  const currentDate = new Date();

  return currentDate >= providedDate;
}
