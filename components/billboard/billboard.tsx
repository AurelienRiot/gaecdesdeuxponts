"use client";
import { Category } from "@prisma/client";
import Image from "next/image";
import BillboardSkeleton from "../skeleton-ui/billboard-skeleton";

interface BillboardProps {
  category: Category;
}

const Billboard: React.FC<BillboardProps> = ({ category }) => {
  if (!category || !category.imageUrl) {
    return <BillboardSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 items-center  justify-items-center gap-8 p-4 sm:grid-cols-2 sm:p-6 lg:p-8 ">
      <div className=" max-w-xs space-y-6 text-center sm:max-w-xl">
        <h1 className="  font-display text-4xl font-bold   sm:text-5xl lg:text-6xl">
          {category?.name}
        </h1>
        <p>{category?.description}</p>
      </div>
      <div className="relative aspect-square max-h-[50vh] min-h-[300px] overflow-hidden rounded-xl">
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Billboard;
