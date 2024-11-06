export function validateScheduleTimes(times) {
  if (typeof times !== "object" || times === null) {
    return false;
  }

  // Verificamos que el objeto no esté vacío
  if (Object.keys(times).length === 0) return false;

  // Expresión regular para validar el formato de hora "HH:MM" en 24 horas
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  // Verificamos que todas las claves sean días válidos (0 a 6) y que los valores tengan formato correcto
  return Object.entries(times).every(([day, time]) => {
    return (
      ["0", "1", "2", "3", "4", "5", "6"].includes(day) && timeRegex.test(time)
    );
  });
}
