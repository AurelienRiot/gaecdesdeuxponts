"use client";
import { dateFormatter } from "@/lib/utils";
import { CellContext, Row, Table } from "@tanstack/react-table";
import { Button } from "../ui/button";
import Link from "next/link";
import { Checkbox } from "../ui/checkbox";
import { useContext, useState } from "react";
import { changeArchived } from "./products-server-actions";
import { toast } from "sonner";
import { formatPhoneNumber } from "react-phone-number-input";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import Image from "next/image";
import { useRouter } from "next/navigation";

type CreatedAtCellProps<T = {}> = T & {
  createdAt: Date;
};

function CreatedAtCell<T>({ row }: { row: Row<CreatedAtCellProps<T>> }) {
  return (
    <div className="flex md:pl-10">
      {dateFormatter(row.getValue("createdAt"))}
    </div>
  );
}

type NameCellProps<T = {}> = T & {
  name: string;
  userId: string | null;
};

function NameCell<T>({ row }: { row: Row<NameCellProps<T>> }) {
  return (
    <Button asChild variant={"link"} className="px-0">
      {row.original.userId ? (
        <Link href={`/admin/users/${row.original.userId}`}>
          {row.getValue("name")}
        </Link>
      ) : (
        <span>{row.getValue("name")}</span>
      )}
    </Button>
  );
}

type PhoneCellProps<T = {}> = T & {
  phone: string;
};

function PhoneCell<T>({ row }: { row: Row<PhoneCellProps<T>> }) {
  return (
    <>
      {row.getValue("phone") ? (
        <span>{formatPhoneNumber(row.getValue("phone"))}</span>
      ) : (
        <span>Non renseigné</span>
      )}
    </>
  );
}

type TextCellProps<T = {}> = T & {
  text: string;
};

function TextCell<T>({ row }: { row: Row<TextCellProps<T>> }) {
  return (
    <AutosizeTextarea
      className="flex resize-none items-center justify-center border-none bg-transparent pt-4 text-sm outline-none focus-visible:ring-0 disabled:cursor-default disabled:opacity-100"
      placeholder="..."
      value={row.original.text}
      disabled
    />
  );
}

type ArchivedCellProps<T> = T & {
  isArchived: boolean;
  id: string;
};

function ArchivedCell<T>(cell: CellContext<ArchivedCellProps<T>, unknown>) {
  const [status, setStatus] = useState<boolean | "indeterminate">(
    cell.row.original.isArchived,
  );
  const router = useRouter();
  return (
    <Checkbox
      className="self-center"
      checked={status}
      onCheckedChange={async (e) => {
        setStatus("indeterminate");
        const result = await changeArchived({
          id: cell.row.original.id,
          isArchived: e,
        });
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

type NameWithImageCellProps<T = {}> = T & {
  imageUrl: string;
  id: string;
  name: string;
  type: "products" | "categories";
};

function NameWithImageCell<T>({
  row,
}: {
  row: Row<NameWithImageCellProps<T>>;
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
        <span>{row.getValue("name")}</span>
      </Link>
    </Button>
  );
}

export {
  CreatedAtCell,
  NameCell,
  ArchivedCell,
  PhoneCell,
  TextCell,
  NameWithImageCell,
};
