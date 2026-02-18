"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  compareAsc,
  eachMonthOfInterval,
  endOfMonth,
  format,
  parseISO,
  startOfYear,
  eachWeekOfInterval,
  eachDayOfInterval,
  isValid,
  startOfMonth,
  getWeekOfMonth,
} from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


const chartConfig = {
  desktop: {
    label: "Total Spent",
    color: "hsl(var(--chart-1))",
  },
};

// Function to get months from the start of the year till the current month
function getMonthsTillCurrent() {
  const now = new Date();
  const months = eachMonthOfInterval({
    start: startOfYear(now),
    end: endOfMonth(now),
  });
  return months.map((month) => format(month, 'MMMM'));
}

// Function to group data by week

function groupDataByWeek(data) {
  const grouped = {};

  data?.forEach((item) => {
    const date = parseISO(item.date);
    const weekOfMonth = getWeekOfMonth(date, { weekStartsOn: 1 }); // Get the week number within the month, assuming weeks start on Monday (weekStartsOn: 1)

    if (!grouped[weekOfMonth]) {
      grouped[weekOfMonth] = { date: `Week ${weekOfMonth}`, totalSpent: 0 };
    }

    grouped[weekOfMonth].totalSpent += item.totalSpent;
  });

  return Object.values(grouped);
}

// Function to group data by day
function groupDataByDay(data) {
  const grouped = {};

  data?.forEach((item) => {
    const parsedDate = parseISO(item.date);

    // Ensure that the date is valid before processing
    if (isValid(parsedDate)) {
      const day = format(parsedDate, 'yyyy-MM-dd'); // Format the date to group by day

      if (!grouped[day]) {
        grouped[day] = { date: format(parsedDate, 'PPP'), totalSpent: 0 }; // Store the formatted day name
      }

      grouped[day].totalSpent += item.totalSpent;
    } else {
      console.error(`Invalid date found: ${item.date}`); // Handle invalid dates
    }
  });

  // Reverse the grouped data (if needed) and return as an array
  return Object.values(grouped).reverse();
}

function groupDataBySpecificDateAndHour(data, specificDate) {
  const grouped = {};
  console.log(data);
  
  
  // Ensure all 24 hours are initialized with 0 spent
  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour.toString()?.padStart(2, '0') + ":00";
    grouped[formattedHour] = { hour: formattedHour, totalSpent: 0 }; // Initialize all hours with 0
  }

  // Filter data for the specific date and sum total spent per hour
  data?.forEach((item) => {


    const itemHour = format(parseISO(item.date), 'HH:00'); // Get the hour (e.g., "14:00")

    // Add the total spent for the specific hour
    if (grouped[itemHour]) {
      grouped[itemHour].totalSpent += item.totalSpent;
    }

  });

  return Object.values(grouped); // Convert the object to an array
}

// Main chart component
export function AreaChart1({ chartData, date }) {




  let formattedChartData;

  // Check if chartData is valid
  const validChartData = chartData?.filter((item) => isValid(parseISO(item.date)));

  if (date === 'all') {
    // For 'all', get total spent per month
    formattedChartData = getMonthsTillCurrent().map((month) => {
      const monthData = validChartData?.filter(item => format(parseISO(item.date), 'MMMM') === month);
      return {
        date: month,
        totalSpent: monthData?.reduce((sum, item) => sum + item.totalSpent, 0),
      };
    });
  }
  else if (!date[0] || compareAsc(date[0].toDateString(), date[1].toDateString()) === 0) {

    formattedChartData = groupDataBySpecificDateAndHour(validChartData);
  }
  else if (date[0] && date[1]) {


    const startOfMonthDate = startOfMonth(new Date(date[0]));
    const endOfMonthDate = endOfMonth(new Date(date[1]));

    if (compareAsc(startOfMonthDate, date[0]) === 0 && compareAsc(endOfMonthDate, date[1]) === 0) {
      // Group by week within the month
      formattedChartData = groupDataByWeek(validChartData);
    } else {
      // Group by day if it's a week range
      formattedChartData = groupDataByDay(validChartData);
    }
  }

  // Sort data by date for the chart
  if (formattedChartData) {
    formattedChartData.sort((a, b) => compareAsc(parseISO(a.date || a.hour), parseISO(b.date || b.hour)));
  }



  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        data={formattedChartData}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={date === 'all' ? 'date' : (date[0] && compareAsc(date[0], date[1]) === 0 ? 'hour' : 'date')}
          tickFormatter={(value) => {
            if (date === 'all') {
              return value; // Show the month name as is (already formatted in getMonthsTillCurrent)
            }

            if (date[0] && compareAsc(date[0], date[1]) === 0) {
              // For specific date, show hours
              return value; // Since hours are already formatted as "HH:00"
            } else {
              // For day/week ranges, show days formatted as 'EEE, MMM d'
              const parsedDate = parseISO(value);
              return isValid(parsedDate) ? format(parsedDate, 'EEE, MMM d') : '';
            }
          }}
          tickMargin={8}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Area
          dataKey="totalSpent"
          type="natural"
          fill="var(--chart-3)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
        />
      </AreaChart>
      <div className="px-2">
          <p className="text-sm text-zinc-400">Disclaimer: Please note that all data displayed are based on the ISO 8601 format.</p>
        </div>
    </ChartContainer>
  );
}
