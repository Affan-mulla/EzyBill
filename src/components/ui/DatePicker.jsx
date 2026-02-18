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
  const [date, setDate] = React.useState(null); // Date range [start, end]

  const handleSelect = (value) => {
    let selectedDateStart = null;
    let selectedDateEnd = null;

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
    if (onChangeDate) {
      onChangeDate(selectedRange);
    }
  };

  const handleDateSelect = (selectedDate) => {
    if (!selectedDate) {
      setDate(null);
      if (onChangeDate) {
        onChangeDate(null);
      }
      return;
    }

    // Handle range selection from calendar
    if (selectedDate.from && selectedDate.to) {
      const finalRange = [startOfDay(selectedDate.from), endOfDay(selectedDate.to)];
      setDate(finalRange);
      if (onChangeDate) {
        onChangeDate(finalRange);
      }
    } else if (selectedDate.from) {
      // Only start date selected, keep as object temporarily for visual feedback
      setDate(selectedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger >
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
              `${format(date[0], "PPP")} - ${format(date[1], "PPP")}`
            ) : date.from ? (
              date.to ? (
                `${format(date.from, "PPP")} - ${format(date.to, "PPP")}`
              ) : (
                format(date.from, "PPP")
              )
            ) : (
              <span>Pick a date range</span>
            )
          ) : (
            <span>Pick a date range</span>
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
            mode="range"
            defaultMonth={
              Array.isArray(date) 
                ? date[0] 
                : date?.from 
                ? date.from 
                : new Date()
            }
            selected={
              Array.isArray(date) 
                ? { from: date[0], to: date[1] }
                : date || undefined
            }
            onSelect={handleDateSelect}
            numberOfMonths={2}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
