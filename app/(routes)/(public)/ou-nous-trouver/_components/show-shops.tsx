"use client";
import NameInput from "@/components/display-shops/name-input";
import { SimpleShopCard } from "@/components/display-shops/simple-shop-card";
import { TagFilter } from "@/components/display-shops/tag-filter";
import type { FullShop } from "@/types";
import { useState } from "react";

function ShowShops({ shops }: { shops: FullShop[] }) {
  const [sortedShops, setSortedShops] = useState<FullShop[]>(shops);
  return (
    <div className="space-y-4 px-6">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <NameInput setSortedShops={setSortedShops} shops={shops} className="w-full max-w-60" />
        <TagFilter setSortedShops={setSortedShops} shops={shops} className="w-full max-w-60" />
      </div>

      <div className=" grid 3xl:grid-cols-5 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 justify-center">
        {sortedShops.map((shop) => (
          <div key={shop.id} className="w-full max-w-sm mx-auto">
            <SimpleShopCard shop={shop} className="h-full w-full max-w-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowShops;
