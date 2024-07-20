"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
  ChartLegend,
} from "@/components/ui/chart";

export function UserProducts({
  chartData,
  productName,
  monthYear,
}: {
  chartData: {
    name: string;
    productQuantities: {
      [x: string]: number;
    };
    total: number;
  }[];
  productName: string[];
  monthYear: string;
}) {
  const chartConfig = productName.reduce((acc, key, index) => {
    acc[key] = {
      label: key,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return acc;
  }, {} as ChartConfig);

  const data = chartData.map((item) => ({
    name: item.name,
    ...item.productQuantities,
    total: item.total,
  }));

  return (
    <Card className=" w-full max-w-xl">
      <CardHeader>
        <CardTitle>Produits achetés par clients</CardTitle>
        <CardDescription>{monthYear}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
            />
            <XAxis dataKey="total" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.entries(chartConfig).map(([key, { label, color }]) => (
              <Bar key={key} dataKey={key} layout="vertical" stackId="a" fill={color} radius={5}>
                <LabelList dataKey={key} position="center" fill="white" fontSize={14} />
              </Bar>
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
      </CardFooter> */}
    </Card>
  );
}
