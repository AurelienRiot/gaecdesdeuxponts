"use client";

import { Bar, BarChart, LabelList, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import DownloadChart from "./dowload-chart";

const ID = "products-pie";

export function ProductsPie({
  pieData,
  monthYear,
}: {
  pieData: {
    name: string;
    total: number;
  }[];
  monthYear: string;
}) {
  const chartConfig = {
    total: {
      label: "Total",
    },
    name: {
      label: "Produit",
    },
  } satisfies ChartConfig;

  return (
    <>
      <Card id={ID} className=" w-full max-w-xl">
        <CardHeader>
          <CardTitle className="flex justify-between">
            Total par produit
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
                          {name} : <span className="font-bold">{value}</span>
                        </p>
                      )}
                    />
                  }
                />
                <Pie
                  data={pieData.map((data, index) => ({ ...data, fill: `hsl(var(--chart-${index + 1}))` }))}
                  dataKey="total"
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
                        {payload.name}
                      </text>
                    );
                  }}
                  nameKey="name"
                >
                  <LabelList
                    dataKey="total"
                    fill="white"
                    stroke="none"
                    fontSize={12}
                    className="font-bold tabular-nums"
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center">Aucun produit</div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
