export function formatNamesForCalendar(names) {
  if (names.length === 1) {
    return names[0]
      .split(" ")
      .reverse()
      .reduce(
        (accu, curr) => curr[0].toUpperCase() + curr.slice(1) + " " + accu,
        ""
      );
  }

  return names
    .map(
      (name) =>
        name.split(" ")[0][0].toUpperCase() + name.split(" ")[0].slice(1)
    )
    .join(", ");
}
