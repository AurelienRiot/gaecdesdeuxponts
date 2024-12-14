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

      <div className="flex flex-wrap items-stretch justify-center gap-4">
        {sortedShops.map((shop) => (
          <div key={shop.id} className="flex-grow min-w-xs max-w-xs">
            <SimpleShopCard shop={shop} className="h-full w-full max-w-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowShops;
