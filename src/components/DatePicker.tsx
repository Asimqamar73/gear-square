import { ChevronDown, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";
import { Calendar as CalendarComponent } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";

interface IDatePicker {
  open: boolean;
  setOpen: (open: boolean) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  text?: string;
}

function DatePicker({ 
  open, 
  setOpen, 
  date, 
  setDate, 
  text = "Select date" 
}: IDatePicker) {
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={`justify-start text-left font-normal
            border-2 hover:border-blue-400 hover:bg-blue-50/50
            transition-all duration-200
            ${!date && "text-gray-500"}
            ${date && "border-blue-200 bg-blue-50/30"}
          `}
          aria-label={date ? `Selected date: ${formatDate(date)}` : text}
        >
          <Calendar className="mr-2 h-4 w-4 text-blue-600" />
          <span className="flex-1">
            {date ? formatDate(date) : text}
          </span>
          <ChevronDown className={`
            h-4 w-4 text-gray-400 transition-transform duration-200
            ${open ? "rotate-180" : ""}
          `} />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 shadow-xl border-2 border-gray-200 rounded-xl overflow-hidden" 
        align="start"
      >
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-4 py-3">
          <p className="text-sm font-medium text-white/90">Select Date</p>
          {date && (
            <p className="text-xs text-white/70 mt-0.5">
              {formatDate(date)}
            </p>
          )}
        </div>
        <div className="bg-white p-3">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setOpen(false);
            }}
            initialFocus
            className="rounded-md"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker