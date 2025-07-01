"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";

export function Combobox({
  data,
  emptyMessage,
  placeholder,
  value,
  handleProductChange,
  item,
  itemIdx,
}: {
  data: any;
  emptyMessage: string;
  placeholder: string;
  value: any;
  item: any;
  handleProductChange: any;
  itemIdx: number;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between h-11 border rounded-sm p-2 bg-teal-50/30 border-gray-400"
        >
          {data?.find((datum: any) => datum?.id === item?.product?.id)?.name || placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-gray-200 border-gray-400">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {data.map((datum: any) => (
                <CommandItem
                  key={datum.id}
                  value={datum.name}
                  onSelect={() => {
                    handleProductChange(datum.id, itemIdx);
                    setOpen(false);
                  }}
                >
                  {datum.name}
                  <Check
                    className={cn("ml-auto", value === datum.name ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
