"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  quantity: {
    label: "Quantité",
  },
} satisfies ChartConfig;

export function Component({
  chartData,
  monthYear,
}: {
  chartData: {
    name: string;
    quantity: number;
  }[];
  monthYear: string;
}) {
  return (
    <Card className=" w-full max-w-xl">
      <CardHeader>
        <CardTitle>Quantité des produits</CardTitle>
        <CardDescription>{monthYear}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel hideIndicator />} />
            <Bar dataKey="quantity">
              <LabelList position="bottom" dataKey="name" fillOpacity={1} />
              <LabelList
                position="center"
                dataKey="quantity"
                offset={12}
                className="fill-white font-bold"
                fontSize={12}
              />
              {chartData.map((item) => (
                <Cell key={item.name} fill={item.quantity > 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"} />
              ))}
            </Bar>
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
