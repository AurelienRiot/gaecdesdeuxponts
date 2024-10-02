"use client";

import { Bar, BarChart, LabelList, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import DownloadChart from "./dowload-chart";

const ID = "camember-clients";

export function UserChart({
  chartData,
  monthYear,
}: {
  chartData: {
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
            Total des paiements par clients
            <DownloadChart id={ID} />
          </CardTitle>

          <CardDescription className="capitalize">{monthYear}</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ChartContainer
              className="w-full   pb-0"
              style={{ height: `${25 + chartData.length * 75}px` }}
              config={chartConfig}
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                  top: 10,
                  left: 14,
                }}
                barCategoryGap={10}
              >
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={5}
                  className="text-[10px] sm:text-xs"
                  axisLine={false}
                  hide
                  // tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                />
                <XAxis dataKey="totalSpent" type="number" hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                {/* <ChartLegend content={<ChartLegendContent />} /> */}
                {/* {Object.entries(chartConfig).map(([key, { label, color }], index) => {
                const isLast = index === Object.entries(chartConfig).length - 1;
                const isFirst = index === 0;
                return ( */}
                <Bar
                  dataKey={"totalSpent"}
                  layout="vertical"
                  stackId="a"
                  fill={`hsl(var(--chart-1))`}
                  radius={[4, 4, 4, 4]}
                >
                  <LabelList
                    position="insideTopLeft"
                    style={{ transform: "translateY(-20px)", fontWeight: "bold" }}
                    dataKey="name"
                    fill="hsla(var(--foreground))"
                    width={300}
                  />
                  <LabelList
                    dataKey={"totalSpent"}
                    position="center"
                    fill="white"
                    className="tabular-nums font-bold"
                    fontSize={14}
                    formatter={(value: string) => `${value} €`}
                  />
                </Bar>
                {/* );
              })} */}
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex justify-center items-center h-full">Aucune Commande</div>
          )}
        </CardContent>
        {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
      </CardFooter> */}
      </Card>
      {/* <Card id={ID} className=" w-full max-w-xl">
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
      
      </Card> */}
    </>
  );
}
