import { cn } from "@/lib/utils";
import Image from "next/image";
import { linkNames } from "../react-icons/links";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";

export type DefaultNotifications = typeof defaultNotifications;

export const defaultNotifications = {
  sendShippingEmail: true,
  sendInvoiceEmail: true,
};

export type NameWithImageProps = {
  name: string;
  image?: string | null;
  url?: string;
  imageSize?: number;
  displayImage?: boolean;
  displayName?: boolean;
  completed?: boolean | null;
  className?: string;
};

export const NameWithImage = ({
  name,
  image,
  imageSize = 16,
  displayImage = true,
  displayName = true,
  completed = true,
  className,
}: NameWithImageProps) => (
  <div className={cn("flex items-center justify-start gap-2 w-full font-medium text-xs group", className)}>
    {displayImage ? (
      image ? (
        <Image
          src={image}
          alt="user"
          width={imageSize * 2}
          height={imageSize}
          style={{ width: imageSize * 2, height: imageSize * 2 }}
          className="object-contain rounded-sm bg-transparent"
        />
      ) : (
        <div
          style={{ width: imageSize * 2, height: imageSize * 2 }}
          className=" rounded-full bg-gray-200 flex items-center justify-center shrink-0  "
        >
          <span className="text-gray-600 font-semibold text-xs underline decoration-gray-200 decoration-2 underline-offset-4 ">
            {name.charAt(0)}
          </span>
        </div>
      )
    ) : null}
    {displayName && <span className={cn(" truncate", !completed ? "text-destructive" : "")}>{name}</span>}
  </div>
);

export const DisplayLink = ({ value, label, className }: { value: string; label: string; className?: string }) => {
  const Icon = linkNames.find((link) => label === link.label)?.Icon;
  return (
    <Link
      href={value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`}
      target="_blank"
      className={cn(buttonVariants({ variant: "link" }), className)}
    >
      {Icon && <Icon className="mr-2 size-4" />}
      {label}
    </Link>
  );
};
