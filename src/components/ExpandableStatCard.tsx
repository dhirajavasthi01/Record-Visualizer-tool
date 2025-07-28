import  { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ExpandableStatCard = ({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) => {
  const [expanded, setExpanded] = useState(false);
  const entries = Object.entries(data);
  const visibleItems = expanded ? entries : entries.slice(0, 5);

  return (
    <Card className="rounded-2xl shadow-md border bg-white p-4">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-gray-800">
        {visibleItems.map(([key, value]) => (
          <div key={key}>{key}: <strong>{value}</strong></div>
        ))}
        {entries.length > 5 && (
          <button
            className="text-xs text-blue-600 hover:underline mt-2"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpandableStatCard;
