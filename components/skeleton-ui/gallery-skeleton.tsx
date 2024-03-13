import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import GalleryTab from "./gallery-tab-skeleton";
import { Skeleton } from "./skeleton";

const Gallery = () => {
  return (
    <Tabs defaultValue={"0"} className="flex flex-col-reverse">
      <div className="mx-auto mt-6  block w-full max-w-2xl  lg:max-w-none">
        <TabsList className="grid h-fit grid-cols-4 gap-6 ">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <GalleryTab key={i} index={String(i)} />
            ))}
        </TabsList>
      </div>
      <div className="aspect-square w-full bg-white sm:rounded-lg">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <TabsContent value={String(i)} key={i}>
              <div className="relative aspect-square h-full w-full overflow-hidden sm:rounded-lg">
                <Skeleton className=" h-full w-full"></Skeleton>
              </div>
            </TabsContent>
          ))}
      </div>
    </Tabs>
  );
};

export default Gallery;
