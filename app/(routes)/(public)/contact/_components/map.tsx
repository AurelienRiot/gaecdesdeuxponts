import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Map from "@/public/map.webp";

const MapDisplay = ({
  className,
  href,
}: {
  className?: string;
  href: string;
}) => {
  return (
    <div
      className={cn(
        " relative mb-16 hidden items-start  justify-start  sm:flex sm:justify-center  lg:mb-0",
        className,
      )}
    >
      <PinContainer title="Laiterie du Pont Robert" href={href}>
        <Image
          src={Map}
          placeholder="blur"
          alt="carte"
          sizes="(max-width: 400px) 90vw, 400px"
          width={400}
          height={400}
          className="aspect-square h-full max-w-[90vw]  transition-all duration-700  sm:w-[400px]"
        />
      </PinContainer>
    </div>
  );
};

export default MapDisplay;

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  title?: string;
  href: string;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <Link
      className={cn("group/pin relative  cursor-pointer ", containerClassName)}
      href={href}
      target={"_blank"}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute  left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2 "
      >
        <div
          className="absolute left-1/2 top-1/2 flex  items-start justify-start  overflow-clip  rounded-2xl border  border-white/[0.2] bg-black p-4 shadow-[0_8px_16px_rgb(0_0_0/0.4)] transition
          duration-700 
         [transform:translate(-50%,-50%)_rotateX(40deg)_scale(0.8)]
          "
        >
          <div className={cn(" relative overflow-clip rounded-2xl", className)}>
            {children}
          </div>
        </div>
      </div>
      <PinPerspective title={title} />
    </Link>
  );
};

export const PinPerspective = ({ title }: { title?: string }) => {
  return (
    <div className="group/btn pointer-events-none  z-[60] flex h-80 w-96 items-center justify-center opacity-100 transition duration-500">
      <div className=" inset-0 -mt-7 h-full w-full  flex-none">
        <div className="absolute inset-x-0 top-0  flex justify-center group-hover/btn:opacity-40">
          <p className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10 ">
            <span className="relative z-20 inline-block py-0.5 text-xs font-bold text-white ">
              {title}
            </span>

            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-orange-400/0 via-orange-400/90 to-emerald-400/0 transition-opacity duration-500 "></span>
          </p>
        </div>

        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
        >
          {[
            "animate-[opacity_6s_linear_infinite]",
            "animate-[opacity_6s_linear_2s_infinite]",
            "animate-[opacity_6s_linear_4s_infinite]",
          ].map((item) => (
            <div
              key={item}
              className={
                "absolute left-1/2 top-1/2  h-[11.25rem] w-[11.25rem]  rounded-[50%] bg-yellow-500/5 shadow-[0_8px_16px_rgb(0_0_0/0.4)] " +
                item
              }
            />
          ))}
        </div>

        <>
          <Icons.Tractor className="absolute bottom-1/2 right-1/2 z-40 h-4 w-4 translate-x-2 translate-y-5 " />
          <div
            className="absolute bottom-1/2 right-1/2 h-40 w-px  translate-y-[14px] scale-50 
          bg-gradient-to-b  from-transparent to-red-500    blur-[2px]"
          />
          <div
            className="absolute bottom-1/2 right-1/2  h-40 w-px translate-y-[14px] bg-gradient-to-b from-transparent 
          to-red-500  "
          />
          <div className="absolute bottom-1/2 right-1/2 z-40 h-[4px] w-[4px] translate-x-[1.5px] translate-y-[14px] rounded-full bg-red-600 blur-[3px]" />
          <div className="absolute bottom-1/2 right-1/2 z-40 h-[2px] w-[2px] translate-x-[0.5px] translate-y-[14px] rounded-full bg-red-300 " />
        </>
      </div>
    </div>
  );
};
