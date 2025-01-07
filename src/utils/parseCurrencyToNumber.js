export function parseCurrencyToNumber(currencyString) {
  if (!currencyString) return NaN;

  if (typeof currencyString === "number") return currencyString;

  // Remover caracteres no numéricos excepto el punto decimal y el signo negativo
  const numericString = currencyString.replace(/[^0-9.-]/g, "");

  const result = parseFloat(numericString);

  return isNaN(result) ? NaN : result;
}
