"use client";

import * as React from "react";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  startOfDay,
  endOfDay,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DatePickerWithPresets({ onChangeDate }) {
  const [date, setDate] = React.useState(null); // A single date or a date range (array)

  const handleSelect = (value) => {
    let selectedDateStart = null;
    let selectedDateEnd = new Date(); // Current date

    switch (value) {
      case "0": // Today
        selectedDateStart = startOfDay(new Date());
        selectedDateEnd = endOfDay(new Date());
        break;
      case "thisWeek": // This Week
        selectedDateStart = startOfWeek(new Date());
        selectedDateEnd = endOfWeek(new Date());
        break;
      case "thisMonth": // This Month
        selectedDateStart = startOfMonth(new Date());
        selectedDateEnd = endOfMonth(new Date());
        break;
      case "all": // All time
        selectedDateStart = null;
        selectedDateEnd = null;
        break;
      default:
        break;
    }

    const selectedRange = value === "all" ? null : [selectedDateStart, selectedDateEnd];
    setDate(selectedRange);
    onChangeDate(selectedRange); // Now trigger the date change
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            Array.isArray(date) ? (
              `${format(date[0], "P")} - ${format(date[1], "P")}`
            ) : (
              format(date, "P")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select onValueChange={handleSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={date ? date[0] : null} // Handle single date selection in the calendar
            onSelect={(newDate) => {
              setDate(newDate); // Update the date with the selected single date
              onChangeDate(newDate); // Trigger the update after selection
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
