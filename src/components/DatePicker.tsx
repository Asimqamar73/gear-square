"use client";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
// import { Label } from "../../components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";

interface IDatePicker {
  open: any;
  setOpen: any;
  date: any;
  setDate: any;
  text: string;
}

export function DatePicker({ open, setOpen, date, setDate, text="Select date" }: IDatePicker) {
  //   const [open, setOpen] = React.useState(false)
  //   const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" id="date" className="w-48 justify-between font-normal">
            {date ? date.toLocaleDateString() : text}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0 bg-gray-100 shadow" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            buttonVariant={"ghost"}
            onSelect={(d) => {
              setDate(d);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
