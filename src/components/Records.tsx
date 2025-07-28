import { useEffect, useState } from "react";
import type { CostRecord } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";

export const columns: ColumnDef<CostRecord>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) => `$${row.original.cost.toFixed(2)}`,
  },
  {
    accessorKey: "projectName",
    header: "Project",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
];

const Records = () => {
  const [data, setData] = useState<CostRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://mocki.io/v1/ba8b0c54-c2cd-42e5-94c3-d8dde894765f");
      const json = await res.json();
      setData(json.costData);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Records</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Records;
