"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClipboardEdit } from "lucide-react";
import { forwardRef } from "react";
import { Icons } from "../icons";
import { Skeleton } from "./skeleton";

type ShopCardProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> & {
  display: "admin" | "find" | "cart" | "profile";
};

export const ShopCard = forwardRef<HTMLDivElement, ShopCardProps>(
  ({ display, className, ...props }, ref) => {
    return (
      <>
        <Card
          data-state={display}
          className={cn(
            "flex h-full w-full min-w-[300px] max-w-[90vw] flex-col justify-between ",
            className,
          )}
          ref={ref}
          {...props}
        >
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {["Adresse", "Téléphone", "Mail", "Site internet"].map((key) => (
              <CardDescription
                key={key}
                className="justify-left flex flex-row items-center gap-4"
              >
                <span className="font-bold">{key} :</span>{" "}
                <Skeleton className="h-4 w-28" />
              </CardDescription>
            ))}
          </CardContent>
          {display === "admin" && (
            <CardFooter className="flex flex-row items-end justify-between  gap-2">
              <Button
                disabled
                variant="destructive"
                className="hover:underline"
              >
                Supprimer
              </Button>
              <Button
                disabled
                variant={"expandIcon"}
                iconPlacement="right"
                Icon={ClipboardEdit}
              >
                Modifier
              </Button>
            </CardFooter>
          )}
          {display === "cart" && (
            <CardFooter className="flex flex-row  justify-center  gap-2">
              <Button
                disabled
                variant={"expandIcon"}
                iconPlacement="right"
                Icon={Icons.pinMap}
                className="place-items-end"
              >
                Selectionner
              </Button>
            </CardFooter>
          )}
        </Card>
      </>
    );
  },
);

ShopCard.displayName = "ShopCard";
