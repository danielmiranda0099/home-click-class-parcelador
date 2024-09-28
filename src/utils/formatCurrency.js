export function formatCurrency(value) {
  if (!value) return "";
  // Asegurarse de que el valor es una cadena
  const stringValue =
    typeof value === "number" ? value.toFixed(2) : value.toString();

  // Remover todo lo que no sean dígitos (opcional: incluir el punto decimal si es necesario)
  const numericValue = stringValue.replace(/[^0-9.]/g, "");

  // Separar parte entera y decimal
  const [integerPart, decimalPart] = numericValue.split(".");

  // Insertar comas en la parte entera
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  // Devolver el valor formateado con la parte decimal si existe
  return decimalPart
    ? `$${formattedIntegerPart}.${decimalPart}`
    : `$${formattedIntegerPart}`;
}
