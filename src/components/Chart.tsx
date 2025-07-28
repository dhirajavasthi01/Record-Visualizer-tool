import type { AggregatedData } from "@/types";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

 export const renderChart = (chartType:string,filteredData:AggregatedData[]) => {
    switch (chartType) {
      case "line":
        return (
          <LineChart data={filteredData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="cost" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={filteredData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="cost" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        );
      case "bar":
      default:
        return (
          <BarChart data={filteredData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cost" fill="#8884d8" />
          </BarChart>
        );
    }
  };