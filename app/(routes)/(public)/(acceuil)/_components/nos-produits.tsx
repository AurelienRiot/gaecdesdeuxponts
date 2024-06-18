import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CornerRightUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = React.HTMLAttributes<HTMLDivElement> & {
  index: number;
  name: string;
  description: string;
  href: string;
  imageUrl: string;
};

export const ProductCard = ({
  imageUrl,
  name,
  description,
  href,
  index,
  className,
  ...props
}: ProductCardProps) => {
  const backgroundColors = [
    "var(--slate-900)",
    "var(--stone-900)",
    "var(--zinc-900)",
    "var(--gray-900)",
  ];
  return (
    <div
      className={cn(
        "group relative aspect-square h-full w-[400px] max-w-[90vw] overflow-hidden rounded-lg border-2 border-slate-50 bg-neutral-700 shadow-lg",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-grid-slate-100/10 dark:bg-grid-slate-700/25" />

      <div className="absolute inset-0 bottom-1/2 right-0 flex h-1/2 flex-col items-center justify-center overflow-hidden p-6">
        <h3 className="z-20 w-fit rounded-md bg-neutral-900/20 px-2 py-1 text-center text-xl font-semibold text-neutral-50 backdrop-blur-sm transition-all group-hover:bg-transparent group-hover:backdrop-blur-none md:text-3xl">
          {name}
        </h3>
        <p className="text-sm font-light tracking-wide text-neutral-300">
          {description}
        </p>
      </div>

      <div className="absolute inset-0 right-0 top-0 z-10 transition-all duration-200 group-hover:right-1/2 group-hover:top-1/2">
        {" "}
        <Image
          src={imageUrl}
          fill
          className="pointer-events-none object-cover grayscale-0 transition-all duration-200 group-hover:grayscale"
          alt={name}
          sizes="(max-width: 450px) 90vw,  400px"
        />
      </div>
      <div className="absolute bottom-0 right-0 z-0 h-1/2 w-0 overflow-hidden transition-all duration-200 group-hover:w-1/2">
        <Button
          asChild
          variant={"shine"}
          className="group/button absolute left-1/2 top-1/2 w-fit -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
        >
          <Link href={href} aria-label={`En savoir + ${name}`}>
            En savoir +{" "}
            <CornerRightUp className="ml-2 size-0 transition-all group-hover/button:size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
