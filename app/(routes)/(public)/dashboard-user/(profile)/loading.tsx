import IconButton from "@/components/ui/icon-button";
import { ChevronLeft, CircleUserRound, Package, Settings } from "lucide-react";
import Image from "next/image";

const Loading = () => {
  const ICONS = [CircleUserRound, Package, Settings];

  return (
    <div
      className=" 
    relative mx-auto mt-4 flex h-[calc(100vh-297px)] w-full  justify-between gap-4   pr-4 [perspective:1000px] sm:h-[calc(100vh-220px)]"
    >
      <div
        className={
          " absolute bottom-0 left-0 top-0 z-20 flex  flex-col items-center justify-start gap-4 overflow-hidden bg-background  p-4 shadow-lg transition-transform duration-500 [perspective:1000px]"
        }
      >
        <IconButton
          icon={
            <ChevronLeft className="h-4 w-4  transition-transform duration-500 " />
          }
          className=" flex w-full items-center justify-center  transition-transform duration-500"
        ></IconButton>
        {ICONS.map((Icon, idx) => {
          return (
            <button
              key={idx}
              className={
                "justify-left relative flex h-[40px] w-[50px] items-center gap-2 rounded-md px-4 py-2 transition-transform duration-500 hover:opacity-80"
              }
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {idx === 0 && (
                <div
                  className={
                    "absolute inset-0 rounded-md bg-gray-200  dark:bg-zinc-800 "
                  }
                />
              )}
              <Icon className="relative size-4 shrink-0 " />
            </button>
          );
        })}
      </div>

      <div className="relative ml-24 h-full w-full sm:ml-28">
        <div
          style={{
            scale: 1,
            top: 0,
          }}
          className={
            "absolute left-0 top-0 h-[95%]  w-full  overflow-y-auto  rounded-2xl border bg-gradient-to-br from-neutral-50 to-stone-100  shadow-md   dark:from-stone-950 dark:to-neutral-950  "
          }
        >
          <div className="relative h-full w-full ">
            <Image
              fill
              src="/skeleton-image.webp"
              alt="image"
              className="animate-pulse rounded-2xl object-cover"
              sizes="90vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
