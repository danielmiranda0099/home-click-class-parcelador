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

export function InputSearch({
  value,
  setValue,
  data = [],
  placeholder = "Search",
  ...props
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex gap-2 max-w-full">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex-1 justify-between"
            {...props}
          >
            {value
              ? data?.find((item) => item.value === value?.value)?.label
              : placeholder}
            <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <Button
          variant="outline"
          onClick={() => setValue(null)}
          type="button"
          disabled={props.disabled || !value}
        >
          Clear
        </Button>
      </div>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {data?.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(
                      currentValue === value?.value
                        ? null
                        : { ...item, value: currentValue }
                    );
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={`mr-2 h-4 w-4 ${value === item.value ? "opacity-100" : "opacity-0"}`}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
