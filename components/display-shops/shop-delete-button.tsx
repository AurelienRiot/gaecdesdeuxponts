"use client";

import deleteShop from "@/app/(routes)/admin/shops/[shopId]/_actions/delete-shop";
import useServerAction from "@/hooks/use-server-action";
import { ClipboardEdit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertModal } from "../ui/alert-modal-form";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";

function ShopDeleteButton({ shopId }: { shopId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { serverAction, loading } = useServerAction(deleteShop);

  const onDelete = async () => {
    function onSuccess() {
      router.push(`/admin/categories`);
      router.refresh();
    }
    serverAction({ data: { id: shopId }, onSuccess, onFinally: () => setOpen(false) });
  };
  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} />
      <CardFooter className="flex flex-row items-end justify-between  gap-2">
        <Button variant="outline" disabled={loading} onClick={() => setOpen(true)} className="hover:underline">
          Supprimer
        </Button>
        <Button variant={"expandIcon"} disabled={loading} iconPlacement="right" Icon={ClipboardEdit} asChild>
          <Link href={`/admin/shops/${shopId}`}>Modifier</Link>
        </Button>
      </CardFooter>
    </>
  );
}

export default ShopDeleteButton;
