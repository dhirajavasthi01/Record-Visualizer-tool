import type { AggregatedData, CostRecord } from "@/types";


export const aggregateData = (data: CostRecord[], type: string): AggregatedData[] => {
  const grouped: Record<string, number> = {};
  data.forEach((item) => {
    const date = new Date(item.date);
    let key = "";
    switch (type) {
      case "week":
        const firstDayOfWeek = new Date(date);
        firstDayOfWeek.setDate(date.getDate() - date.getDay());
        key = firstDayOfWeek.toISOString().split("T")[0];
        break;
      case "month":
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
        break;
      case "date":
      default:
        key = item.date;
    }
    grouped[key] = (grouped[key] || 0) + item.cost;
  });
  return Object.entries(grouped).map(([name, cost]) => ({ name, cost }));
};