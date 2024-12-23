import ButtonBackwardSkeletton from "@/components/skeleton-ui/button-backward-skeletton";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DAYS_OF_WEEK } from "@/lib/date-utils";

function Loading() {
  return (
    <div className=" space-y-4 h-full pt-20 pb-10">
      <div className="fixed top-0 right-0 left-0 z-10 bg-background">
        <div className="max-w-[90vw] md:max-w-[500px] mx-auto flex py-2 gap-4 items-center justify-between">
          <ButtonBackwardSkeletton />
          <Button>Produits favoris</Button>
          <Button variant="outline" className="w-fit ">
            <Skeleton size={"icon"} />
            <Skeleton size={"sm"} className="ml-2" />
          </Button>
        </div>
        <Separator />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4  px-4  relative h-full">
        <DayCard day={-1} />
        {DAYS_OF_WEEK.map((_, index) => {
          const day = (index + 1) % 7;
          return <DayCard key={day} day={day} />;
        })}
      </div>
    </div>
  );
}

function DayCard({ day }: { day: number }) {
  const dayName = day === -1 ? "Commande par defaut" : DAYS_OF_WEEK[day];
  return (
    <Card className={"max-w-md w-full"}>
      <CardHeader>
        <Button className="w-46 mx-auto " variant={"outline"}>
          {dayName}
          <Skeleton size={"icon"} className="ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        <Skeleton size={"lg"} className="mx-auto" />
      </CardContent>
    </Card>
  );
}

export default Loading;
