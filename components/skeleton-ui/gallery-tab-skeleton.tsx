import { cn } from "@/lib/utils";
import { Image as ImageType } from "@prisma/client";
import Image from "next/image";
import { TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "./skeleton";

interface GalleryTabProps {
  index: string;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ index }) => {
  return (
    <TabsTrigger
      value={index}
      className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white"
    >
      <div>
        <span className="absolute inset-0 aspect-square h-full w-full overflow-hidden rounded-md transition-transform hover:scale-105 ">
          <Skeleton className=" h-full w-full"></Skeleton>
        </span>
        <span
          className={cn(
            "selected absolute inset-0 rounded-md ring-2 ring-offset-2"
              ? "ring-black"
              : "ring-transparent",
          )}
        />
      </div>
    </TabsTrigger>
  );
};

export default GalleryTab;
