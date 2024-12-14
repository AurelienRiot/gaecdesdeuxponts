import type { FullShop } from "@/types";
import { useEffect, useState } from "react";
import { tagOptions } from ".";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function TagFilter({
  shops,
  setSortedShops,
  className,
}: {
  shops: FullShop[];
  setSortedShops: React.Dispatch<React.SetStateAction<FullShop[]>>;
  className?: string;
}) {
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!selectedTag || selectedTag === "all tags") {
      setSortedShops(shops);
    } else {
      const filtered = shops.filter((shop) => shop.tags.includes(selectedTag));
      setSortedShops(filtered);
    }
  }, [selectedTag, shops, setSortedShops]);

  return (
    <div className={className}>
      <Select value={selectedTag} onValueChange={setSelectedTag}>
        <SelectTrigger id="tag-select" className="w-full">
          <SelectValue placeholder="Filter par mots-clés" />
        </SelectTrigger>
        <SelectContent side="bottom" avoidCollisions={false}>
          <SelectItem value={"all tags"}>Tous</SelectItem>
          {tagOptions.map((tag) => (
            <SelectItem key={tag.value} value={tag.value}>
              {tag.Icon && <tag.Icon className="mr-2 h-4 w-4 inline-block" />}
              {tag.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
