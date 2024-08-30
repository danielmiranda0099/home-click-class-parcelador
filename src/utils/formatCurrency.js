export function formatCurrency(value) {
  const numericValue = value.replace(/[^0-9]/g, "");

  // Convertir a un número e insertar las comas
  const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `$${formattedValue}`;
}
