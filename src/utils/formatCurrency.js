export function formatCurrency(value) {
  if (value === 0) return "$0";

  if (value === null || value === undefined || value === "") return "";

  const numericValue =
    typeof value === "number"
      ? value
      : parseFloat(value.toString().replace(/[^0-9.-]/g, ""));

  if (isNaN(numericValue)) return "";

  const isNegative = numericValue < 0;
  const absoluteValue = Math.abs(numericValue);

  const [integerPart, decimalPart] = absoluteValue.toFixed(2).split(".");

  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  const result =
    decimalPart === "00"
      ? formattedIntegerPart // Si es un número cerrado
      : `${formattedIntegerPart}.${decimalPart}`; // Si tiene decimales

  return isNegative ? `-$${result}` : `$${result}`;
}
