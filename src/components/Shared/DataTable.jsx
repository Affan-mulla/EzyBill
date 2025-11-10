import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerWithPresets } from "@/components/ui/DatePicker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

/**
 * Enhanced Generic DataTable Component
 * 
 * Features:
 * - Debounced search for better performance
 * - Skeleton loading states
 * - Smooth animations with Framer Motion
 * - Date filtering support
 * - Sorting capabilities
 * - Responsive pagination
 * - Better empty states
 * - Fully generic and reusable
 * 
 * @param {Object} props
 * @param {Array} props.columns - Table column definitions
 * @param {Array} props.data - Table data
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.filterColumn - Column key to filter by (e.g., 'productName')
 * @param {string} props.filterPlaceholder - Placeholder text for search input
 * @param {Function} props.onDateChange - Callback for date filter changes
 * @param {boolean} props.showDateFilter - Whether to show date filter
 * @param {number} props.pageSize - Initial page size (default: 10)
 * @param {string} props.emptyMessage - Custom empty state message
 */
export function DataTable({
  columns,
  data = [],
  isLoading = false,
  filterColumn = "name",
  filterPlaceholder = "Search...",
  onDateChange,
  showDateFilter = false,
  pageSize = 10,
  emptyMessage = "No results found.",
}) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  
  // Debounce search input to reduce unnecessary re-renders
  const debouncedFilterValue = useDebounce(filterValue, 300);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    initialState: {
      pagination: { pageSize },
    },
    state: {
      columnFilters,
      sorting,
      globalFilter: debouncedFilterValue,
    },
  });

  // Update filter when debounced value changes
  useEffect(() => {
    table.getColumn(filterColumn)?.setFilterValue(debouncedFilterValue);
  }, [debouncedFilterValue, filterColumn, table]);

  const handleDateChange = (newDate) => {
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  // Show skeleton while loading
  if (isLoading) {
    return <TableSkeleton rows={pageSize} columns={columns.length} />;
  }

  return (
    <div className="space-y-6 relative">
      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        {/* Search Input with Icon */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={filterPlaceholder}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="pl-9 h-10 bg-background border-input transition-all duration-200 focus:ring-2 focus:ring-ring focus:ring-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Date Filter */}
        {showDateFilter && (
          <DatePickerWithPresets onChangeDate={handleDateChange} />
        )}

        {/* Results Count */}
        {data.length > 0 && (
          <div className="ml-auto text-sm font-medium text-muted-foreground">
            Showing <span className="text-foreground font-semibold">{table.getRowModel().rows.length}</span> of <span className="text-foreground font-semibold">{data.length}</span>
          </div>
        )}
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-lg border border-border bg-card overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="bg-muted/30 backdrop-blur-sm sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-border hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id}
                      className="font-semibold text-sm text-foreground h-12 px-4"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              <AnimatePresence mode="wait">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className={cn(
                        "border-b border-border transition-colors duration-150",
                        "hover:bg-accent/50 hover:shadow-sm",
                        "data-[state=selected]:bg-accent "
                      )}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-4 py-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-64 text-center"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center gap-3"
                      >
                        <div className="rounded-full bg-muted p-4 shadow-sm">
                          <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-foreground font-semibold text-base">
                            {emptyMessage}
                          </p>
                          {filterValue && (
                            <p className="text-sm text-muted-foreground">
                              Try adjusting your search terms
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Date Filter Disclaimer */}
      {showDateFilter && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-muted-foreground px-1"
        >
          Note: Dates are displayed in Indian Standard Time (IST) format.
        </motion.p>
      )}

      {/* Pagination Section */}
      {table.getPageCount() > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1"
        >
          <div className="text-sm font-medium text-muted-foreground">
            Page <span className="text-foreground font-semibold">{table.getState().pagination.pageIndex + 1}</span> of{" "}
            <span className="text-foreground font-semibold">{table.getPageCount()}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="gap-1.5 h-9 px-3 shadow-sm hover:bg-accent hover:shadow transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="gap-1.5 h-9 px-3 shadow-sm hover:bg-accent hover:shadow transition-all duration-200"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
