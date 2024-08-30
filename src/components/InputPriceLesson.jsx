import { formatCurrency } from "@/utils/formatCurrency";
import { Input } from "./ui/input";

export function InputPriceLesson({ value, setValue }) {
  const handleChange = (event) => {
    const inputValue = event.target.value;
    setValue(formatCurrency(inputValue));
  };

  return (
    <Input type="text" value={value} onChange={handleChange} placeholder="$0" />
  );
}
