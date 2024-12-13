"use client";
import NameInput from "@/components/display-shops/name-input";
import { SimpleShopCard } from "@/components/display-shops/simple-shop-card";
import { TagFilter } from "@/components/display-shops/tag-filter";
import type { FullShop } from "@/types";
import { useState } from "react";

function ShowShops({ shops }: { shops: FullShop[] }) {
  const [sortedShops, setSortedShops] = useState<FullShop[]>(shops);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-start gap-2">
        <NameInput setSortedShops={setSortedShops} shops={shops} className="w-fit" />
        <TagFilter setSortedShops={setSortedShops} shops={shops} />
      </div>

      <div className="grid grid-cols-1 items-center justify-items-center gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {sortedShops.map((shop) => (
          <SimpleShopCard shop={shop} key={shop.name} />
        ))}
      </div>
    </div>
  );
}

export default ShowShops;
