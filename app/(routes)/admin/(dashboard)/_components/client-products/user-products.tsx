"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import DownloadChart from "../dowload-chart";

const ID = "produits-clients";
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
    <Card id={ID} className=" w-full max-w-xl">
      <CardHeader>
        <CardTitle className="flex justify-between">
          Produits achetés par clients
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
              data={data}
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
              <XAxis dataKey="total" type="number" hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {Object.entries(chartConfig).map(([key, { label, color }], index) => {
                const isLast = index === Object.entries(chartConfig).length - 1;
                const isFirst = index === 0;
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    layout="vertical"
                    stackId="a"
                    fill={color}
                    radius={[isFirst ? 4 : 0, isLast ? 4 : 0, isLast ? 4 : 0, isFirst ? 4 : 0]}
                  >
                    {index === 0 && (
                      <LabelList
                        position="insideTopLeft"
                        style={{ transform: "translateY(-20px)" }}
                        dataKey="name"
                        fill="hsla(var(--foreground))"
                        width={300}
                      />
                    )}
                    <LabelList
                      dataKey={key}
                      position="center"
                      fill="white"
                      className="tabular-nums font-bold"
                      fontSize={14}
                    />
                  </Bar>
                );
              })}
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
  );
}
