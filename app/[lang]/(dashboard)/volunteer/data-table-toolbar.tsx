"use client";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { statuses } from "../data/data";
// import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Icon } from "@iconify/react";
import { Table as ReactTable } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";

// const DataRow = (typeof data)[];

interface DataTableToolbarProps {
  table: ReactTable<any>;
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const [search, setSearch] = useState(""); // Manage the input state

  console.log("search", search);

  const isFiltered = table.getState().columnFilters.length > 0;
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Input value: ", value); // Log the input value
    setSearch(value); // Update the state as the user types
    table.setGlobalFilter(value); // Apply global filter to the table
  };
  return (
    <div className="flex flex-col md:flex-row  gap-4">
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* <div className="flex items-center gap-3">
          <span className="text-base font-medium text-default-600">Show</span>
          <Select>
            <SelectTrigger className="w-20" size="md" radius="sm">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent className="w-20 min-w-[80px]">
              {Array.from({ length: 9 }, (_, index) => {
                const number = index + 10;
                return (
                  <SelectItem key={number} value={`${number}`}>
                    {number}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div> */}
        <div>
          <Input
            value={search} // Set input value to the state variable
            onChange={handleSearch} // Call the handleSearch function on input change
            // onChange={(e) => {
            //   console.log("e", e);
            // }}
            // onChange={function (e) {
            //   console.log(e);
            // }}
            placeholder="Search Volunteer..."
            // className="min-w-[200px] sm:max-w-[248px] ltr:pl-7 rtl:pr-7 rounded"
          />
        </div>
      </div>
      <div className="flex-none flex flex-col sm:flex-row sm:items-center  gap-4">
        {/* {statusColumn && (
          <DataTableFacetedFilter
            column={statusColumn}
            title="Select Status"
            options={statuses}
          />
        )} */}

        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className=" px-2 lg:px-3"
          >
            Reset
            <X className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
          </Button>
        )}

        <Button asChild>
          <Link href="/add-volunteer">
            <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
            Add Volunteer
          </Link>
        </Button>
      </div>
    </div>
  );
}
