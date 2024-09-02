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
          <CardDescription className="capitalize">{monthYear}</CardDescription>
        </CardHeader>
        <CardContent className="w-full  ">
          {pieData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="w-full aspect-square sm:aspect-video  pb-0 [&_.recharts-pie-label-text]:fill-foreground "
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, item) => (
                        <p className="flex items-center gap-1">
                          <span
                            className={"shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg] h-2.5 w-2.5"}
                            style={
                              {
                                "--color-bg": item.payload.fill,
                                "--color-border": item.payload.fill,
                              } as React.CSSProperties
                            }
                          />{" "}
                          {name} : <span className="font-bold">{value} €</span>
                        </p>
                      )}
                    />
                  }
                />
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
                        className="relative"
                        textAnchor={props.textAnchor}
                        dominantBaseline={props.dominantBaseline}
                        fill="hsla(var(--foreground))"
                      >
                        {/* {left || right
                        ? (payload.name as string).split(" ").map((word, index) => (
                            <tspan x={right ? props.x - 10 : props.x} y={`${index * 20 + props.y}`} key={index}>
                              {word}
                            </tspan>
                          ))
                        : payload.name} */}
                        {payload.name}
                      </text>
                    );
                  }}
                  nameKey="name"
                >
                  <LabelList
                    dataKey="totalSpent"
                    fill="white"
                    stroke="none"
                    fontSize={12}
                    className="font-bold tabular-nums"
                    formatter={(value: number) => `${value} €`}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center">Aucun client</div>
          )}
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
