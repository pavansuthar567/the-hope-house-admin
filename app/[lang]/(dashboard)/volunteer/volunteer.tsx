"use client";

import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import Card from "@/components/ui/card-snippet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { DataTableToolbar } from "./data-table-toolbar";

interface Task {
  firstName?: string;
}
const getformattedDate = (date: Date): string => {
  return date?.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => (
      <span className="text-default-600 inline-block min-w-[100px]">
        {row.getValue("firstName")}
      </span>
    ),
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => (
      <span className="text-default-600 inline-block min-w-[100px]">
        {row.getValue("lastName")}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-default-600">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => (
      <span className="text-default-600 text-nowrap inline-block min-w-[120px]">
        {row.getValue("phoneNumber")}
      </span>
    ),
  },
  {
    accessorKey: "address",
    header: "address",
    cell: ({ row }) => {
      const address = row.getValue("address") as any;
      return (
        <span className="text-default-600 min-w-[240px] inline-block  break-keep">
          {address?.street} {address?.city} {address?.state} {address?.country}{" "}
          {address?.postalCode}
        </span>
      );
    },
  },
  {
    accessorKey: "dateOfBirth",
    header: "DOB",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateOfBirth"));
      return <span className="text-default-600">{getformattedDate(date)}</span>;
    },
  },
  {
    accessorKey: "gender",
    header: "gender",
    cell: ({ row }) => (
      <span className="text-default-600">{row.getValue("gender")}</span>
    ),
  },
  {
    accessorKey: "skills",
    header: "skills",
    cell: ({ row }) => {
      const skills = row.getValue("skills") as string[];
      return (
        <div className="flex gap-2">
          <div className="text-default-600 flex gap-1">
            {skills?.map((x, i) => (
              <Badge
                className="inline-block min-w-fit"
                key={`skill-${x}-${i}`}
                variant="outline"
              >
                {x}
              </Badge>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "availability",
    header: "availability",
    cell: ({ row }) => (
      <span className="text-default-600">{row.getValue("availability")}</span>
    ),
  },
  {
    accessorKey: "joinedDate",
    header: "joinedDate",
    cell: ({ row }) => (
      <span className="text-default-600">
        {getformattedDate(new Date(row.getValue("joinedDate")))}
      </span>
    ),
  },
  {
    accessorKey: "experience",
    header: "experience",
    cell: ({ row }) => (
      <span className="text-default-600">{row.getValue("experience")}</span>
    ),
  },
  {
    accessorKey: "emergencyContact",
    header: "Emerg. Contact",
    cell: ({ row }) => {
      const phone = row.getValue("emergencyContact") as IEmergencyContact;
      return (
        <span className="text-default-600 text-nowrap inline-block min-w-[120px]">
          {phone?.phoneNumber}
        </span>
      );
    },
  },
];

const RowEditingDialog = () => {
  return (
    <Card title="Volunteer">
      <CardContent>
        <DataTable data={users} columns={columns} />
      </CardContent>
    </Card>
  );
};

export default RowEditingDialog;

interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface IEmergencyContact {
  name: string;
  phoneNumber: string;
  relation: string;
}

export interface DataRows {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: IAddress;
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other";
  skills: string[];
  availability: "Full-time" | "Part-time" | "Weekends";
  joinedDate: Date;
  experience?: string;
  emergencyContact: IEmergencyContact;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}
export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  //   const customFilterFn: any = (rows, columnId, filterValue) => {
  //     // custom filter logic
  //     console.log("rows", rows, columnId, filterValue);
  //   };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      <div className="pb-6">
        <DataTableToolbar table={table} />
      </div>
      <div className="border rounded space-y-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DataTablePagination table={table} />
      </div>
    </>
  );
}

interface DataTablePaginationProps<TData> {
  table: any;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center flex-wrap gap-2 justify-between p-5">
      {/* <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div> */}
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          Rows per page
        </p>
        {/* <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      </div>
      <div className="flex flex-wrap items-center gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const EditingDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          color="secondary"
          className=" h-7 w-7"
        >
          <Icon icon="heroicons:pencil" className=" h-4 w-4  " />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <form action="#" className=" space-y-5 pt-4">
            <div>
              <Label className="mb-2">Name</Label>
              <Input placeholder="Name" />
            </div>
            {/* end single */}
            <div>
              <Label className="mb-2">Title</Label>
              <Input placeholder="Title" />
            </div>
            {/* end single */}
            <div>
              <Label className="mb-2">Email</Label>
              <Input placeholder="Email" type="email" />
            </div>
            {/* end single */}
            <div>
              <Label className="mb-2">Email</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Admin</SelectItem>
                  <SelectItem value="dark">Owner</SelectItem>
                  <SelectItem value="system">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* end single */}
            <div className="flex justify-end space-x-3">
              <DialogClose asChild>
                <Button type="button" variant="outline" color="destructive">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button color="success">Save</Button>
              </DialogClose>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const users: DataRows[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phoneNumber: "+1 555-1234",
    address: {
      street: "123 Elm St",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "USA",
    },
    dateOfBirth: new Date(1990, 4, 15),
    gender: "Male",
    skills: ["JavaScript", "React", "Node.js"],
    availability: "Full-time",
    joinedDate: new Date(2021, 6, 1),
    experience: "5 years",
    emergencyContact: {
      name: "Jane Doe",
      phoneNumber: "+1 555-4321",
      relation: "Spouse",
    },
  },
  {
    id: 2,
    firstName: "Emily",
    lastName: "Smith",
    email: "emily.smith@email.com",
    phoneNumber: "+1 555-5678",
    address: {
      street: "456 Oak St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
    },
    dateOfBirth: new Date(1992, 7, 24),
    gender: "Female",
    skills: ["Python", "Django", "AWS"],
    availability: "Part-time",
    joinedDate: new Date(2020, 2, 10),
    experience: "3 years",
    emergencyContact: {
      name: "Mark Smith",
      phoneNumber: "+1 555-8765",
      relation: "Brother",
    },
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@email.com",
    phoneNumber: "+1 555-7890",
    address: {
      street: "789 Pine St",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "USA",
    },
    dateOfBirth: new Date(1985, 11, 3),
    gender: "Male",
    skills: ["Java", "Spring", "Docker"],
    availability: "Full-time",
    joinedDate: new Date(2019, 11, 12),
    experience: "7 years",
    emergencyContact: {
      name: "Sarah Brown",
      phoneNumber: "+1 555-0987",
      relation: "Spouse",
    },
  },
  {
    id: 4,
    firstName: "Sophia",
    lastName: "Johnson",
    email: "sophia.johnson@email.com",
    phoneNumber: "+44 555-1234",
    address: {
      street: "123 Maple St",
      city: "London",
      state: "England",
      postalCode: "E1 6AN",
      country: "UK",
    },
    dateOfBirth: new Date(1995, 2, 28),
    gender: "Female",
    skills: ["Ruby", "Rails", "PostgreSQL"],
    availability: "Weekends",
    joinedDate: new Date(2022, 4, 15),
    emergencyContact: {
      name: "James Johnson",
      phoneNumber: "+44 555-5678",
      relation: "Father",
    },
  },
  {
    id: 5,
    firstName: "Lucas",
    lastName: "Williams",
    email: "lucas.williams@email.com",
    phoneNumber: "+1 555-3456",
    address: {
      street: "234 Cedar St",
      city: "Houston",
      state: "TX",
      postalCode: "77001",
      country: "USA",
    },
    dateOfBirth: new Date(1988, 6, 10),
    gender: "Male",
    skills: ["PHP", "Laravel", "MySQL"],
    availability: "Full-time",
    joinedDate: new Date(2018, 8, 9),
    experience: "10 years",
    emergencyContact: {
      name: "Linda Williams",
      phoneNumber: "+1 555-6543",
      relation: "Mother",
    },
  },
  {
    id: 6,
    firstName: "Olivia",
    lastName: "Jones",
    email: "olivia.jones@email.com",
    phoneNumber: "+61 555-7894",
    address: {
      street: "456 Spruce St",
      city: "Sydney",
      state: "NSW",
      postalCode: "2000",
      country: "Australia",
    },
    dateOfBirth: new Date(1993, 9, 16),
    gender: "Female",
    skills: ["C#", ".NET", "Azure"],
    availability: "Part-time",
    joinedDate: new Date(2020, 7, 20),
    experience: "4 years",
    emergencyContact: {
      name: "David Jones",
      phoneNumber: "+61 555-0984",
      relation: "Brother",
    },
  },
  {
    id: 7,
    firstName: "Ethan",
    lastName: "Davis",
    email: "ethan.davis@email.com",
    phoneNumber: "+1 555-5674",
    address: {
      street: "789 Birch St",
      city: "San Francisco",
      state: "CA",
      postalCode: "94101",
      country: "USA",
    },
    dateOfBirth: new Date(1991, 5, 5),
    gender: "Male",
    skills: ["Go", "Kubernetes", "GCP"],
    availability: "Full-time",
    joinedDate: new Date(2019, 3, 11),
    experience: "6 years",
    emergencyContact: {
      name: "Emma Davis",
      phoneNumber: "+1 555-7654",
      relation: "Sister",
    },
  },
  {
    id: 8,
    firstName: "Mia",
    lastName: "Garcia",
    email: "mia.garcia@email.com",
    phoneNumber: "+34 555-8765",
    address: {
      street: "123 Palm St",
      city: "Madrid",
      state: "Community of Madrid",
      postalCode: "28001",
      country: "Spain",
    },
    dateOfBirth: new Date(1990, 10, 12),
    gender: "Female",
    skills: ["JavaScript", "Vue.js", "GraphQL"],
    availability: "Full-time",
    joinedDate: new Date(2021, 2, 28),
    experience: "4 years",
    emergencyContact: {
      name: "Carlos Garcia",
      phoneNumber: "+34 555-5678",
      relation: "Brother",
    },
  },
  {
    id: 9,
    firstName: "Benjamin",
    lastName: "Martinez",
    email: "benjamin.martinez@email.com",
    phoneNumber: "+1 555-2345",
    address: {
      street: "234 Redwood St",
      city: "Miami",
      state: "FL",
      postalCode: "33101",
      country: "USA",
    },
    dateOfBirth: new Date(1996, 12, 30),
    gender: "Male",
    skills: ["Python", "Flask", "Machine Learning"],
    availability: "Part-time",
    joinedDate: new Date(2021, 8, 4),
    experience: "2 years",
    emergencyContact: {
      name: "Laura Martinez",
      phoneNumber: "+1 555-7654",
      relation: "Sister",
    },
  },
  {
    id: 10,
    firstName: "Amelia",
    lastName: "Lopez",
    email: "amelia.lopez@email.com",
    phoneNumber: "+52 555-6543",
    address: {
      street: "345 Willow St",
      city: "Mexico City",
      state: "Mexico City",
      postalCode: "01000",
      country: "Mexico",
    },
    dateOfBirth: new Date(1987, 1, 14),
    gender: "Female",
    skills: ["Java", "Android", "Firebase"],
    availability: "Full-time",
    joinedDate: new Date(2017, 5, 22),
    experience: "8 years",
    emergencyContact: {
      name: "Luis Lopez",
      phoneNumber: "+52 555-2345",
      relation: "Husband",
    },
  },
  {
    id: 11,
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@email.com",
    phoneNumber: "+61 555-5432",
    address: {
      street: "123 Eucalyptus St",
      city: "Melbourne",
      state: "VIC",
      postalCode: "3000",
      country: "Australia",
    },
    dateOfBirth: new Date(1992, 4, 6),
    gender: "Male",
    skills: ["JavaScript", "React", "AWS"],
    availability: "Part-time",
    joinedDate: new Date(2020, 9, 15),
    experience: "3 years",
    emergencyContact: {
      name: "Mary Wilson",
      phoneNumber: "+61 555-7654",
      relation: "Mother",
    },
  },
  {
    id: 12,
    firstName: "Grace",
    lastName: "Lee",
    email: "grace.lee@email.com",
    phoneNumber: "+1 555-1237",
    address: {
      street: "456 Cherry St",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "USA",
    },
    dateOfBirth: new Date(1989, 9, 18),
    gender: "Female",
    skills: ["HTML", "CSS", "JavaScript"],
    availability: "Weekends",
    joinedDate: new Date(2018, 4, 1),
    experience: "5 years",
    emergencyContact: {
      name: "Thomas Lee",
      phoneNumber: "+1 555-3456",
      relation: "Father",
    },
  },
  {
    id: 13,
    firstName: "Daniel",
    lastName: "Clark",
    email: "daniel.clark@email.com",
    phoneNumber: "+44 555-1238",
    address: {
      street: "789 Chestnut St",
      city: "Birmingham",
      state: "England",
      postalCode: "B1 1AN",
      country: "UK",
    },
    dateOfBirth: new Date(1994, 11, 22),
    gender: "Male",
    skills: ["C++", "Unity", "Game Development"],
    availability: "Full-time",
    joinedDate: new Date(2022, 5, 10),
    emergencyContact: {
      name: "Lucy Clark",
      phoneNumber: "+44 555-8765",
      relation: "Sister",
    },
  },
  {
    id: 14,
    firstName: "Chloe",
    lastName: "Moore",
    email: "chloe.moore@email.com",
    phoneNumber: "+1 555-4321",
    address: {
      street: "123 Fir St",
      city: "Toronto",
      state: "ON",
      postalCode: "M5H 2N2",
      country: "Canada",
    },
    dateOfBirth: new Date(1985, 8, 11),
    gender: "Female",
    skills: ["Swift", "iOS", "Xcode"],
    availability: "Part-time",
    joinedDate: new Date(2023, 3, 18),
    experience: "2 years",
    emergencyContact: {
      name: "Ethan Moore",
      phoneNumber: "+1 555-6789",
      relation: "Husband",
    },
  },
  {
    id: 15,
    firstName: "Jacob",
    lastName: "Taylor",
    email: "jacob.taylor@email.com",
    phoneNumber: "+1 555-5436",
    address: {
      street: "456 Oak St",
      city: "Vancouver",
      state: "BC",
      postalCode: "V6E 2H1",
      country: "Canada",
    },
    dateOfBirth: new Date(1990, 3, 5),
    gender: "Male",
    skills: ["JavaScript", "TypeScript", "Node.js"],
    availability: "Full-time",
    joinedDate: new Date(2019, 7, 25),
    experience: "4 years",
    emergencyContact: {
      name: "Emma Taylor",
      phoneNumber: "+1 555-8764",
      relation: "Wife",
    },
  },
];
