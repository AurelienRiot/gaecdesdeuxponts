import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "../ui/badge";
import { Skeleton } from "./skeleton";

const Info = () => {
  return (
    <div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="mt-3 items-end justify-between">
        <p className="text-2xl text-gray-900 dark:text-white">
          <Skeleton as="span" className="h-4 w-24" />
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <hr className="my-4" />
      <>
        <h2 className="mb-4 mt-8 text-xl">Produits liées</h2>
        <div className="flex flex-wrap gap-1">
          {Array(3)
            .fill(null)
            .map((_, i) => {
              return (
                <Badge key={i}>
                  <Skeleton className="h-2 w-12 self-center" />
                </Badge>
              );
            })}
        </div>
        <hr className="my-4" />
      </>
      <div className="mt-10 flex items-center gap-x-3">
        <Button
          variant="rounded"
          className="flex items-center gap-x-2 hover:scale-105"
        >
          Ajouter au panier
          <ShoppingCart />
        </Button>
      </div>

      {Array(10)
        .fill(null)
        .map((_, i) => (
          <Skeleton key={i} className={`w- mt-4 h-4 ${randomWidth()}`} />
        ))}
    </div>
  );
};

export default Info;

// Function to generate a random width class
const randomWidth = () => {
  // Define the range of widths for your skeletons
  const widths = [
    "w-14",
    "w-24",
    "w-32",
    "w-40",
    "w-48",
    "w-52",
    "w-56",
    "w-60",
    "w-64",
    "w-72",
    "w-80",
    "w-96",
  ];
  // Select a random width from the widths array
  const randomIndex = Math.floor(Math.random() * widths.length);
  return widths[randomIndex];
};
