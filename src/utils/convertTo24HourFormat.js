export function convertTo24HourFormat(time12) {
  const [time, ampm] = time12.split(/(am|pm)/i);
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);

  if (ampm.toLowerCase() === "pm" && hours !== 12) {
    hours += 12;
  } else if (ampm.toLowerCase() === "am" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${minutes}`;
}
