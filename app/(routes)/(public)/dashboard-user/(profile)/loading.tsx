import Image from "next/image";

const Loading = () => {
  return (
    <div className="relative ml-24 mt-5 h-full w-full sm:ml-28 sm:mt-10">
      <div
        style={{
          scale: 1,
          top: 0,
        }}
        className={
          "absolute left-0 top-0 h-[95%] w-full overflow-y-auto  rounded-2xl  border bg-gradient-to-br from-neutral-50 to-stone-100 shadow-md  dark:from-stone-950   dark:to-neutral-950 sm:h-[90%]  "
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
  );
};

export default Loading;
