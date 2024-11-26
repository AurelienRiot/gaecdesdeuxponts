"use client";

import SelectSheet from "@/components/select-sheet";
import { NameWithImage } from "@/components/user";
import useServerAction from "@/hooks/use-server-action";
import type { Shop } from "@prisma/client";
import { useRouter } from "next/navigation";
import linkShop from "../_actions/link-shop";

function LinkShop({ shops, userId }: { shops: Shop[]; userId: string }) {
  const router = useRouter();
  const { serverAction } = useServerAction(linkShop);

  const onValueChange = async (value: string | undefined) => {
    if (!value) {
      return;
    }
    function onSuccess() {
      router.refresh();
    }
    await serverAction({ data: { shopId: value, userId }, onSuccess });
  };

  return (
    <SelectSheet
      triggerClassName="w-fit"
      title="Selectionner le magasin"
      trigger={"Lié un magasin"}
      values={shops.map((shop) => ({
        label: <NameWithImage name={shop.name} image={shop.imageUrl} />,
        value: { key: shop.id },
      }))}
      onSelected={(value) => {
        onValueChange(value?.key);
      }}
    />
  );
}

export default LinkShop;