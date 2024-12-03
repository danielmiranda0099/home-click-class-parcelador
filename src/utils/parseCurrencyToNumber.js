export function parseCurrencyToNumber(currencyString) {
  if (!currencyString) return NaN;

  // Remover caracteres no numéricos excepto el punto decimal y el signo negativo
  const numericString = currencyString.replace(/[^0-9.-]/g, "");

  const result = parseFloat(numericString);

  return isNaN(result) ? NaN : result;
}
