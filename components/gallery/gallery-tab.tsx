import { cn } from "@/lib/utils";
import Image from "next/image";
import { TabsTrigger } from "@/components/ui/tabs";

interface GalleryTabProps {
  image: string;
  selected?: boolean;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ image, selected }) => {
  return (
    <TabsTrigger
      value={image}
      className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white transition-transform hover:scale-105"
    >
      <div>
        <span className="absolute inset-0 aspect-square h-full w-full overflow-clip rounded-md  ">
          <Image
            fill
            src={image}
            sizes="(max-width: 1024px) 20vw, 12vw"
            alt="image"
            className="object-contain object-center"
          />
        </span>
        <span
          className={cn(
            "absolute inset-0 rounded-md ring-2 ring-offset-2",
            selected ? "ring-black" : "ring-transparent",
          )}
        />
      </div>
    </TabsTrigger>
  );
};

export default GalleryTab;
