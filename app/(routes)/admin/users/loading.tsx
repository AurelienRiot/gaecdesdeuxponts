import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { ChevronDown, ListOrdered } from "lucide-react";

function LoadingPage() {
  return (
    <div className="m-4">
      <Heading title={`Clients `} description="Liste des clients" />
      <div className="justify-content-center mt-4 grid grid-cols-1 gap-4 md:grid-cols-6">
        <Input placeholder="Recherche" disabled={true} />

        <div
          className={
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          }
        >
          <p>Nom</p>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-2 p-6 ">
        {Array.from({ length: 10 }, (_, index) => (
          <Card key={index} className={"flex h-full w-[100px] sm:w-[150px] flex-col justify-between"}>
            <CardHeader className="p-4">
              <CardTitle className="overflow-hidden  font-semibold">
                <Skeleton size={"lg"} />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center p-2">
              <p className="gap-4 flex justify-center items-center">
                {" "}
                <ListOrdered className="size-6" /> <Skeleton size={"xs"} />
              </p>
              <div className="flex flex-row items-center justify-center gap-1">
                <Skeleton size={"lg"} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-end justify-between  gap-1">
              <Button className="text-xs sm:text-sm w-full">Consulter</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default LoadingPage;
