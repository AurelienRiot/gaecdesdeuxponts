"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

export function UserChart({
  pieData,
  monthYear,
}: {
  pieData: {
    name: string;
    totalSpent: number;
  }[];
  monthYear: string;
}) {
  const chartConfig = {
    totalSpent: {
      label: "Total des dépenses",
    },
    name: {
      label: "Client",
    },
  } satisfies ChartConfig;
  return (
    <Card className=" w-full max-w-xl">
      <CardHeader>
        <CardTitle>Clients</CardTitle>
        <CardDescription>{monthYear}</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer
          config={chartConfig}
          className="w-full aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={pieData.map((data, index) => ({ ...data, fill: `hsl(var(--chart-${index + 1}))` }))}
              dataKey="totalSpent"
              label
              nameKey="name"
              // labelFormatter={(value) => `${value}€`}
            >
              <LabelList
                dataKey="name"
                className="fill-background"
                stroke="none"
                fontSize={12}
                // formatter={(value: keyof typeof chartConfig) =>
                //   chartConfig[value]?.label
                // }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
      </CardFooter> */}
    </Card>
  );
}