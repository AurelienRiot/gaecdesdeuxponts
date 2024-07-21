"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import DownloadChart from "./dowload-chart";
import { Package } from "lucide-react";

const ID = "quantite-produits";
const chartConfig = {
  quantity: {
    label: "Quantité",
    icon: Package,
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
    <Card id={ID} className=" w-full max-w-xl">
      <CardHeader>
        <CardTitle className="flex justify-between">
          Quantité des produits
          <DownloadChart id={ID} />
        </CardTitle>
        <CardDescription className="capitalize">{monthYear}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="w-full" style={{ height: `${chartData.length * 50}px` }} config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} horizontal={false} />
            <XAxis type="number" dataKey="quantity" hide />
            <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
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
