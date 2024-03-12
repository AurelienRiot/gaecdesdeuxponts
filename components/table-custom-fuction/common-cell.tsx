"use client";
import { dateFormatter } from "@/lib/utils";
import { Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import Link from "next/link";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { changeArchived } from "./products-server-actions";
import { toast } from "sonner";
import { formatPhoneNumber } from "react-phone-number-input";
import { AutosizeTextarea } from "../ui/autosize-textarea";

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

type ArchivedCellProps<T = {}> = T & {
  isArchived: boolean;
  id: string;
};

function ArchivedCell<T>({ row }: { row: Row<ArchivedCellProps<T>> }) {
  const [status, setStatus] = useState<boolean | "indeterminate">(
    row.original.isArchived,
  );
  return (
    <Checkbox
      className="self-center"
      checked={status}
      onCheckedChange={async (e) => {
        setStatus("indeterminate");
        const result = await changeArchived({
          id: row.original.id,
          isArchived: e,
        });
        if (!result.success) {
          toast.error(result.message);
          setStatus(!e);
        } else {
          toast.success("Statut mis à jour");
          setStatus(e);
        }
      }}
    />
  );
}

export { CreatedAtCell, NameCell, ArchivedCell, PhoneCell, TextCell };
