import { cn } from "@/lib/utils";
import Image from "next/image";
import { TabsTrigger } from "@/components/ui/tabs";

interface GalleryTabProps {
  image: string;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ image }) => {
  return (
    <TabsTrigger
      value={image}
      className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white"
    >
      <div>
        <span className="absolute inset-0 aspect-square h-full w-full overflow-clip rounded-md transition-transform hover:scale-105 ">
          <Image
            fill
            src={image}
            sizes="50vw"
            alt="image"
            className="object-cover object-center"
          />
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
