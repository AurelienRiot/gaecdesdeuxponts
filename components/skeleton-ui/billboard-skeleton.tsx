"use client";
import ImageLoaderBillboard from "@/components/billboard/image-loader-billboard";
import { Skeleton } from "./skeleton";

const Billboard = () => {
  return (
    <div className="overflow-hidden rounded-xl p-4 sm:p-6 lg:p-8">
      <ImageLoaderBillboard src="/skeleton-image.webp">
        <div className="flex h-full w-full flex-col items-center justify-center gap-y-8 text-center">
          <div className="max-w-xs rounded-lg bg-gray-800 bg-opacity-40 p-2 py-6 text-3xl font-bold text-gray-50 sm:max-w-xl sm:text-5xl lg:text-6xl">
            <Skeleton className="h-8  w-96" />
          </div>
        </div>
      </ImageLoaderBillboard>
    </div>
  );
};

export default Billboard;
