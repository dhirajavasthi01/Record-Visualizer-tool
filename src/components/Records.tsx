import { useEffect, useState } from "react";
import type { CostRecord } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const columns: ColumnDef<CostRecord>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "service", header: "Service" },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) => `$${row.original.cost.toFixed(2)}`,
  },
  { accessorKey: "projectName", header: "Project" },
  { accessorKey: "category", header: "Category" },
];

const Records = () => {
  const [data, setData] = useState<CostRecord[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://mocki.io/v1/ba8b0c54-c2cd-42e5-94c3-d8dde894765f");
      const json = await res.json();
      setData(json.costData);
    };
    fetchData();
  }, []);

  const { visibleItems, loaderRef, hasMore } = useInfiniteScroll(data, 10);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">All Records</h1>

      {!isMobile ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <div className="space-y-4">
          {visibleItems.map((record) => (
            <Card key={record.id} className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  {record.projectName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-gray-700">
                <div className="grid gap-1 text-sm text-gray-700">
                  <div><span className="font-medium">Date:</span> {record.date}</div>
                  <div><span className="font-medium">Department:</span> {record.department}</div>
                  <div><span className="font-medium">Service:</span> {record.service}</div>
                  <div><span className="font-medium">Cost:</span> ${record.cost.toFixed(2)}</div>
                  <div><span className="font-medium">Category:</span> {record.category}</div>
                </div>
              </CardContent>
            </Card>
          ))}

          {hasMore && (
            <div
              ref={loaderRef}
              className="h-10 text-center flex items-center justify-center text-sm text-gray-500"
              style={{ visibility: "visible" }}
            >
              Loading more...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Records;
