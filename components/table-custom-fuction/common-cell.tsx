"use client";
import useServerAction from "@/hooks/use-server-action";
import { dateFormatter } from "@/lib/date-utils";
import type { ReturnTypeServerAction } from "@/lib/server-action";
import type { Row } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPhoneNumber } from "react-phone-number-input";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import { Button } from "../ui/button";
import { Checkbox, type CheckedState } from "../ui/checkbox";
import Currency from "../ui/currency";

type DateCellProps = {
  date: Date;
  hours?: boolean;
  days?: boolean;
};

function DateCell({ date, hours, days }: DateCellProps) {
  return <div className="text-left">{dateFormatter(date, { hours, days })}</div>;
}

type NameCellProps = {
  name: string;
  image?: string | null;
  url?: string;
};

function NameCell({ image, name, url }: NameCellProps) {
  return (
    <Button asChild variant={url ? "link" : "ghost"} className="px-0">
      {url ? (
        <Link href={url}>
          <NameWithImage name={name} image={image} imageSize={50} />
        </Link>
      ) : (
        <span>{name}</span>
      )}
    </Button>
  );
}

const NameWithImage = ({
  name,
  image,
  imageSize = 16,
}: { name: string; image?: string | null; imageSize?: number }) => (
  <div className="flex items-center justify-start gap-4 w-full">
    <Image
      src={image ? image : "/skeleton-image.webp"}
      alt="user"
      width={imageSize * 2}
      height={imageSize}
      className="mr-2 object-contain rounded-sm bg-white"
    />
    {name}
  </div>
);

type PhoneCellProps = {
  phone: string;
};

function PhoneCell<T>({ row }: { row: Row<T & PhoneCellProps> }) {
  return (
    <>{row.getValue("phone") ? <span>{formatPhoneNumber(row.getValue("phone"))}</span> : <span>Non renseigné</span>}</>
  );
}

type TextCellProps = {
  text: string;
};

function TextCell<T>({ row }: { row: Row<T & TextCellProps> }) {
  return (
    <AutosizeTextarea
      className="flex resize-none items-center justify-center border-none bg-transparent pt-4 text-sm outline-none focus-visible:ring-0 disabled:cursor-default disabled:opacity-100"
      placeholder="..."
      value={row.original.text}
      disabled
    />
  );
}

type CheckboxCellProps<R, E> = {
  isCheckbox: boolean;
  id: string;
  action: (data: { checkState: CheckedState; id: string }) => Promise<ReturnTypeServerAction<R, E>>;
};

function CheckboxCell<R, E>({ isCheckbox, action, id }: CheckboxCellProps<R, E>) {
  const [status, setStatus] = useState<boolean | "indeterminate">(isCheckbox);
  const { serverAction, loading } = useServerAction(action);
  const router = useRouter();
  return (
    <Checkbox
      className="self-center"
      checked={status}
      disabled={loading}
      onCheckedChange={async (e) => {
        setStatus("indeterminate");
        await serverAction({
          data: { id, checkState: e },
          onError: () => setStatus(!e),
          onSuccess: () => {
            setStatus(e);
            router.refresh();
          },
        });
      }}
    />
  );
}

type OptionsCellProps = {
  productOptions: {
    price: number;
    options: { name: string; value: string }[];
  }[];
};

function OptionsCell<T>({ row }: { row: Row<T & OptionsCellProps> }) {
  return (
    <ul className="">
      {row.original.productOptions.map((product, index) => {
        const optionsValue = product.options.map((option) => option.value);

        return (
          <li key={index} className=" whitespace-nowrap">
            {optionsValue.length > 0 ? `${optionsValue.join(", ")} : ` : null}
            <Currency value={product.price} />
          </li>
        );
      })}
    </ul>
  );
}

type NameWithImageCellProps = {
  imageUrl: string;
  id: string;
  name: string;
  type: "products" | "categories";
};

function NameWithImageCell<T>({
  row,
}: {
  row: Row<T & NameWithImageCellProps>;
}) {
  return (
    <Button asChild variant={"link"}>
      <Link
        href={`/admin/${row.original.type}/${row.original.id}`}
        className="flex  cursor-pointer items-center justify-start gap-2"
      >
        {row.original.imageUrl ? (
          <span className=" relative aspect-square h-[30px] rounded-sm bg-transparent">
            <Image
              src={row.original.imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 30px, (max-width: 1200px) 30px, 30px"
              className="rounded-sm object-cover"
            />
          </span>
        ) : null}
        <span className="whitespace-nowrap">{row.getValue("name")}</span>
      </Link>
    </Button>
  );
}

export { CheckboxCell, DateCell, NameCell, NameWithImage, NameWithImageCell, OptionsCell, PhoneCell, TextCell };
