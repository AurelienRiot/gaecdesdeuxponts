"use client";

import { LabelList, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import DownloadChart from "./dowload-chart";

const ID = "camember-clients";

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
    <>
      <Card id={ID} className=" w-full max-w-xl">
        <CardHeader>
          <CardTitle className="flex justify-between">
            Clients
            <DownloadChart id={ID} />
          </CardTitle>
          <CardDescription>{monthYear}</CardDescription>
        </CardHeader>
        <CardContent className="w-full  ">
          <ChartContainer
            config={chartConfig}
            className="w-full aspect-square sm:aspect-video  pb-0 [&_.recharts-pie-label-text]:fill-foreground "
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => `${name} : ${value} €`} />} />
              <Pie
                data={pieData.map((data, index) => ({ ...data, fill: `hsl(var(--chart-${index + 1}))` }))}
                dataKey="totalSpent"
                label={({ payload, ...props }) => {
                  return (
                    <text
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill="hsla(var(--foreground))"
                    >
                      {payload.name}
                    </text>
                  );
                }}
                nameKey="name"
              >
                <LabelList
                  dataKey="totalSpent"
                  className="fill-background "
                  stroke="none"
                  fontSize={12}
                  formatter={(value: number) => `${value} €`}
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
    </>
  );
}
