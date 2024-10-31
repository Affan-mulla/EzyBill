import { Button } from "@/components/ui/button";
import { DatePickerWithPresets } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, getFilteredRowModel } from "@tanstack/react-table";
import { useState } from "react";

export function DataTable({ columns, data, fetchData, filterName, DateChange, dateFilter }) {
  const [columnFilters, setColumnFilters] = useState(
    []
  )
  const [pageSize, setPageSize] = useState(4)
  const table = useReactTable({
    data,
    columns: columns(fetchData),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize },
    },
    state: {
      columnFilters,
    },
  });

  const [date, setdate] = useState()

  const handleDate = (newDate) => {
    setdate(newDate)
    DateChange(newDate)
  }
console.log(data);


  return (
    <div>
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Filter Name..."
          value={(table.getColumn(filterName)?.getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn(filterName)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {dateFilter ? (<DatePickerWithPresets onChangeDate={handleDate} />) : (<></>)}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
      </div>
      {dateFilter ? (<div className="px-2">
          <p className="text-sm text-zinc-400">Disclaimer: Please note that all dates and times displayed are based on the ISO 8601 format.</p>
        </div>) : (<></>)}
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
