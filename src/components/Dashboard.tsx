import React, { useEffect, useState, useCallback } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Card, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { aggregateData } from "../utils/aggregateData";
import type { AggregatedData, CostRecord } from "@/types";
import ExpandableStatCard from "./ExpandableStatCard";
import { debounce } from "../utils/debounce"; // 👈 imported here

const Dashboard: React.FC = () => {
  const [rawData, setRawData] = useState<CostRecord[]>([]);
  const [filteredData, setFilteredData] = useState<AggregatedData[]>([]);
  const [filterType, setFilterType] = useState<"week" | "month" | "date">("month");
  const [searchValue, setSearchValue] = useState("");
  const [searchOptions, setSearchOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredRaw, setFilteredRaw] = useState<CostRecord[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("bar");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://mocki.io/v1/ba8b0c54-c2cd-42e5-94c3-d8dde894765f");
      const data = await res.json();
      setRawData(data.costData);
    };
    fetchData();
  }, []);

  const handleSearch = useCallback(
    debounce((value: string, raw: CostRecord[]) => {
      if (value) {
        const lower = value.toLowerCase();
        const matched = raw
          .flatMap((item) => [item.projectName, item.service, item.department])
          .filter((val) => val.toLowerCase().includes(lower));
        const unique = Array.from(new Set(matched));
        setSearchOptions(unique);
        setShowSuggestions(true);
      } else {
        setSearchOptions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    handleSearch(searchValue, rawData);
  }, [searchValue, rawData, handleSearch]);

  useEffect(() => {
    let dataToAggregate = rawData;
    if (selectedOption) {
      dataToAggregate = rawData.filter(
        (item) =>
          item.projectName === selectedOption ||
          item.service === selectedOption ||
          item.department === selectedOption
      );
    }
    setFilteredRaw(dataToAggregate);
    const aggregated = aggregateData(dataToAggregate, filterType);
    setFilteredData(aggregated);
  }, [rawData, filterType, selectedOption]);

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    setSearchValue(option);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSelectedOption(null);
    setShowSuggestions(false);
  };


  const departmentCounts = filteredRaw.reduce((acc, record) => {
    acc[record.department] = (acc[record.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const serviceCounts = filteredRaw.reduce((acc, record) => {
    acc[record.service] = (acc[record.service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const renderChart = () => {
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

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 space-y-6">
      <div>
        <Command className="relative rounded-md border shadow-sm">
          <CommandInput
            placeholder="Search project, service, or department..."
            value={searchValue}
            onValueChange={(val) => {
              setSearchValue(val);
              setShowSuggestions(!!val);
            }}
            onFocus={() => {
              if (searchValue) setShowSuggestions(true);
            }}
            className="pr-8"
          />
          {searchValue && (
            <X
              className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
              onClick={handleClearSearch}
            />
          )}
          {showSuggestions && (
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {searchOptions.map((option, index) => (
                <CommandItem key={index} onSelect={() => handleSelectOption(option)}>
                  {option}
                </CommandItem>
              ))}
            </CommandList>
          )}
        </Command>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ExpandableStatCard title="Department Stats" data={departmentCounts} />
        <ExpandableStatCard title="Service Stats" data={serviceCounts} />
      </div>

      <Card className="rounded-2xl shadow-md border bg-white p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-base">Cost Breakdown</CardTitle>
          <div className="flex gap-4">
            <ToggleGroup
              type="single"
              value={filterType}
              onValueChange={(val) => {
                if (val) setFilterType(val as "week" | "month" | "date");
              }}
            >
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
              <ToggleGroupItem value="date">Date</ToggleGroupItem>
            </ToggleGroup>

            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as "bar" | "line" | "area")}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="area">Area Chart</option>
            </select>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
