"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, SearchIcon } from "./icons";
import { useState } from "react";

const frameworks = [
  { value: "john-doe", label: "John Doe" },
  { value: "jane-smith", label: "Jane Smith" },
  { value: "michael-johnson", label: "Michael Johnson" },
  { value: "emily-davis", label: "Emily Davis" },
  { value: "william-brown", label: "William Brown" },
  { value: "linda-miller", label: "Linda Miller" },
  { value: "robert-jones", label: "Robert Jones" },
  { value: "patricia-wilson", label: "Patricia Wilson" },
  { value: "david-moore", label: "David Moore" },
  { value: "mary-taylor", label: "Mary Taylor" },
  { value: "james-anderson", label: "James Anderson" },
  { value: "susan-thomas", label: "Susan Thomas" },
  { value: "charles-jackson", label: "Charles Jackson" },
  { value: "jessica-white", label: "Jessica White" },
  { value: "daniel-harris", label: "Daniel Harris" },
  { value: "karen-martin", label: "Karen Martin" },
  { value: "matthew-thompson", label: "Matthew Thompson" },
  { value: "nancy-garcia", label: "Nancy Garcia" },
  { value: "christopher-lee", label: "Christopher Lee" },
  { value: "barbara-martinez", label: "Barbara Martinez" },
];

export function InputSearch({ value, setValue }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select a teacher..."}
          <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search teacher.." />
          <CommandList>
            <CommandEmpty>No teacher found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={`mr-2 h-4 w-4 ${value === framework.value ? "opacity-100" : "opacity-0"}`}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
