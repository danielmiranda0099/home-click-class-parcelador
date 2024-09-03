import { formatCurrency } from "@/utils/formatCurrency";
import { Input } from "./ui/input";

export function InputPriceLesson({ value, setValue, ...props }) {
  const handleChange = (event) => {
    const inputValue = event.target.value;
    setValue(formatCurrency(inputValue));
  };

  if (typeof value === "number") {
    value = value.toString();
  }

  value = formatCurrency(value);

  return (
    <Input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="$0"
      {...props}
    />
  );
}
