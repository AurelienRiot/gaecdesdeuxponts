"use client";
import ImageLoaderBillboard from "@/components/billboard/image-loader-billboard";
import { useCategories } from "@/hooks/use-categories";
import { useEffect, useState } from "react";

interface BillboardProps {
  categoryId: string;
}

const Billboard: React.FC<BillboardProps> = ({ categoryId }) => {
  const categories = useCategories((s) => s.categories);
  const [isMounted, setIsMounted] = useState(false);

  const category = categories.find((category) => category.id === categoryId);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!category || !category.imageUrl || !isMounted) {
    return null;
  }
  return (
    <div className="overflow-hidden rounded-xl p-4 sm:p-6 lg:p-8">
      <ImageLoaderBillboard src={category.imageUrl}>
        <div className="flex h-full w-full flex-col items-center justify-center gap-y-8 text-center">
          <div className="max-w-xs rounded-lg bg-gray-800 bg-opacity-40 p-2 pb-3 text-3xl font-bold text-gray-50 sm:max-w-xl sm:text-5xl lg:text-6xl">
            {category?.name}
          </div>
        </div>
      </ImageLoaderBillboard>
    </div>
  );
};

export default Billboard;
