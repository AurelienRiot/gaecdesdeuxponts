import { cn } from "@/lib/utils";
import Image from "next/image";

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
  <div className={cn("flex items-center justify-start gap-2 w-full font-medium text-xs", className)}>
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
          className=" rounded-full bg-gray-200 flex items-center justify-center shrink-0"
        >
          <span className="text-gray-600 font-semibold text-xs no-underline">{name.charAt(0)}</span>
        </div>
      )
    ) : null}
    {displayName && <span className={cn(" truncate", !completed ? "text-destructive" : "")}>{name}</span>}
  </div>
);
