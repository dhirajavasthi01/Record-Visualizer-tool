import  { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";

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
          <Button className="px-0" variant="link" onClick={() => setExpanded(!expanded)}>{expanded ? "Show Less" : "Show More"}</Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpandableStatCard;
