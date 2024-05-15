import SkeletonImage from "@/public/skeleton-image.webp";
import { ChevronDown, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Currency from "../ui/currency";
import { Skeleton } from "./skeleton";
import { IconButton } from "../ui/button";

export const CartItemSkeleton = () => {
  return (
    <>
      <div className="relative size-24  overflow-clip rounded-md bg-white @sm:size-48 ">
        <Image
          src={SkeletonImage}
          sizes="192px"
          fill
          alt="image"
          className="object-cover object-center"
        />
      </div>
      <div className="@sm::ml-6 relative ml-4 flex flex-1 flex-col justify-between">
        <div className="absolute right-0 top-0 z-10">
          <IconButton
            type="button"
            Icon={X}
            iconClassName="size-4 text-primary"
            className="bg-primary-foreground"
            title="Supprimer du panier"
          />
        </div>
        <div className="relative flex h-full flex-col content-center justify-between gap-2">
          <div className="flex flex-wrap gap-2 pr-10 ">
            <Link
              href={"#"}
              className=" font-semibold text-primary @xs:text-lg "
            >
              <Skeleton />
            </Link>
          </div>
          <Currency value={undefined} />
          <CustomQuantitySkeleton />
        </div>
      </div>
    </>
  );
};

const CustomQuantitySkeleton = () => {
  return (
    <div className="flex items-center gap-2 tabular-nums	">
      <button
        className={
          "flex h-10 w-fit items-center justify-center gap-2 rounded-md border border-input bg-background px-2 py-1 text-xs tabular-nums ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        }
      >
        Quantité: <Skeleton size={"xs"} className="inline" />
        <ChevronDown className={" size-3 opacity-50"} />
      </button>
    </div>
  );
};
