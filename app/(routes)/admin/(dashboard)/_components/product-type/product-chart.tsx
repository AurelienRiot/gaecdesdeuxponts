"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Package } from "lucide-react";

const chartConfig = {
  quantity: {
    label: "Quantité",
    icon: Package,
  },
} satisfies ChartConfig;

export function ProductChart({
  chartData,
}: {
  chartData: {
    name: string;
    quantity: number;
  }[];
}) {
  return (
    <ChartContainer className="w-full " style={{ height: `${chartData.length * 50}px` }} config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid vertical={false} horizontal={false} />
        <XAxis type="number" dataKey="quantity" hide />
        <YAxis dataKey="name" type="category" hide />
        <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
        {/* <ReferenceLine x={0} strokeDasharray="1 3" stroke="hsla(var(--muted-foreground))" /> */}
        <Bar dataKey="quantity" barSize={25}>
          <LabelList position="top" dataKey="name" fill="hsla(var(--foreground))" width={300} />
          <LabelList
            position="center"
            dataKey="quantity"
            offset={12}
            className="fill-white font-bold tabular-nums"
            fontSize={12}
          />
          {chartData.map((item) => (
            <Cell key={item.name} fill={item.quantity > 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
