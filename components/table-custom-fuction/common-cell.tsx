"use client";
import { dateFormatter } from "@/lib/date-utils";
import type { Row } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import Currency from "../ui/currency";

type DateCellProps = {
  date: Date;
  hours?: boolean;
};

function DateCell({ date, hours }: DateCellProps) {
  return <div className="flex md:pl-10">{dateFormatter(date, hours)}</div>;
}

type NameCellProps = {
  name: string;
  url?: string;
};

function NameCell({ name, url }: NameCellProps) {
  return (
    <Button asChild variant={url ? "link" : "ghost"} className="px-0">
      {url ? <Link href={url}>{name}</Link> : <span>{name}</span>}
    </Button>
  );
}

type PhoneCellProps =  {
  phone: string;
};

function PhoneCell<T>({ row }: { row: Row<T & PhoneCellProps> }) {
  return (
    <>
      {row.getValue("phone") ? (
        <span>{formatPhoneNumber(row.getValue("phone") as any)}</span>
      ) : (
        <span>Non renseigné</span>
      )}
    </>
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

type CheckboxCellProps = {
  isCheckbox: boolean;
  onChange: (e: boolean | "indeterminate") => Promise<
    | {
        success: true;
      }
    | {
        success: false;
        message: string;
      }
  >;
};

function CheckboxCell({ isCheckbox, onChange }: CheckboxCellProps) {
  const [status, setStatus] = useState<boolean | "indeterminate">(isCheckbox);
  const router = useRouter();
  return (
    <Checkbox
      className="self-center"
      checked={status}
      onCheckedChange={async (e) => {
        setStatus("indeterminate");
        const result = await onChange(e);
        if (!result.success) {
          toast.error(result.message);
          setStatus(!e);
        } else {
          setStatus(e);
          router.refresh();
          toast.success("Statut mis à jouer");
        }
      }}
    />
  );
}

type OptionsCellProps=  {
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
          <li key={index}>
            {optionsValue.length > 0 ? `${optionsValue.join(", ")} : ` : null}
            <Currency value={product.price} />
          </li>
        );
      })}
    </ul>
  );
}

type NameWithImageCellProps=  {
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

export {
  CheckboxCell,
  DateCell,
  NameCell,
  NameWithImageCell,
  OptionsCell,
  PhoneCell,
  TextCell,
};
