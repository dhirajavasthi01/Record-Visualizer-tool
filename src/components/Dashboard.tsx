import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ResponsiveContainer } from "recharts";
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
import type { CostRecord } from "@/types";
import ExpandableStatCard from "./ExpandableStatCard";
import { debounce } from "../utils/debounce";
import { renderChart } from "./Chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const Dashboard: React.FC = () => {
  const [rawData, setRawData] = useState<CostRecord[]>([]);
  const [filterType, setFilterType] = useState<"week" | "month" | "date">("month");
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("bar");
  const [searchValue, setSearchValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [searchOptions, setSearchOptions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://mocki.io/v1/ba8b0c54-c2cd-42e5-94c3-d8dde894765f");
        const data = await res.json();
        setRawData(data.costData);
      } catch (err) {
        console.error("Failed to fetch cost data", err);
      }
    };
    fetchData();
  }, []);

  const handleSearch = useCallback(
    debounce((value: string, data: CostRecord[]) => {
      const lower = value.toLowerCase();
      const matched = data
        .flatMap(({ projectName, service, department }) => [projectName, service, department])
        .filter((val) => val.toLowerCase().includes(lower));
      const unique = Array.from(new Set(matched));
      setSearchOptions(unique);
      setShowSuggestions(!!unique.length);
    }, 300),
    []
  );

  useEffect(() => {
    if (searchValue) {
      handleSearch(searchValue, rawData);
    } else {
      setSearchOptions([]);
      setShowSuggestions(false);
    }
  }, [searchValue, rawData, handleSearch]);

  const filteredRaw = useMemo(() => {
    if (!selectedOption) return rawData;
    return rawData.filter(
      ({ projectName, service, department }) =>
        projectName === selectedOption || service === selectedOption || department === selectedOption
    );
  }, [rawData, selectedOption]);

  const aggregatedData = useMemo(() => {
    return aggregateData(filteredRaw, filterType);
  }, [filteredRaw, filterType]);

  const departmentStats = useMemo(() => {
    return filteredRaw.reduce((acc, { department }) => {
      acc[department] = (acc[department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredRaw]);

  const serviceStats = useMemo(() => {
    return filteredRaw.reduce((acc, { service }) => {
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredRaw]);

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    setSearchValue(option);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchValue("");
    setSelectedOption(null);
    setShowSuggestions(false);
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
              onClick={clearSearch}
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
        <ExpandableStatCard title="Department Stats" data={departmentStats} />
        <ExpandableStatCard title="Service Stats" data={serviceStats} />
      </div>

      <Card className="rounded-2xl shadow-md border bg-white p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-base">Cost Breakdown</CardTitle>
          <div className="flex gap-4">
            <ToggleGroup
              type="single"
              value={filterType}
              onValueChange={(val) => {
                if (val) setFilterType(val as typeof filterType);
              }}
            >
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
              <ToggleGroupItem value="date">Date</ToggleGroupItem>
            </ToggleGroup>
            <Select value={chartType} onValueChange={(val: typeof chartType) => setChartType(val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart(chartType, aggregatedData)}
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
