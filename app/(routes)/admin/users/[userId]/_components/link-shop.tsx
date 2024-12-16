"use client";

import SelectSheet, { createShopValues } from "@/components/select-sheet";
import { NameWithImage } from "@/components/user";
import type { UserForOrderType } from "@/components/zod-schema/user-for-orders-schema";
import { useUsersQueryClient } from "@/hooks/use-query/users-query";
import useServerAction from "@/hooks/use-server-action";
import type { Shop } from "@prisma/client";
import linkShop from "../_actions/link-shop";
import { useMemo } from "react";

function LinkShop({ shops, userId }: { shops: Shop[]; userId: string }) {
  const { mutateUsers } = useUsersQueryClient();
  const { serverAction } = useServerAction(linkShop);

  const onValueChange = async (value: string | undefined) => {
    if (!value) {
      return;
    }
    function onSuccess(result?: UserForOrderType) {
      if (result) {
        mutateUsers((users) => users.concat(result));
      }
    }
    await serverAction({ data: { shopId: value, userId }, onSuccess });
  };
  const values = useMemo(() => createShopValues(shops), [shops]);
  return (
    <SelectSheet
      triggerClassName="w-fit"
      title="Selectionner le magasin"
      trigger={"Lié un magasin"}
      values={values}
      onSelected={(value) => {
        onValueChange(value?.key);
      }}
      isSearchable
    />
  );
}

export default LinkShop;
