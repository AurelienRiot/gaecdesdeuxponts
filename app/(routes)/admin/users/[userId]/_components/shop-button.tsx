import type { Shop } from "@prisma/client";
import type { GetUserPageDataProps } from "../_functions/get-user-page-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LinkShop from "./link-shop";

function ShopButton({ user, shops }: { user: GetUserPageDataProps["formatedUser"]; shops: Shop[] }) {
  return user.shop ? (
    <Button asChild className="block w-fit ">
      <Link href={`/admin/shops/${user.shop.id}`}>Modifier le magasin</Link>
    </Button>
  ) : (
    <div className="flex gap-4 flex-wrap sm:justify-start justify-center items-center ">
      <Button asChild variant="outline">
        <Link href={`/admin/shops/new?userId=${user.id}`}>Créer un magasin</Link>
      </Button>

      <LinkShop userId={user.id} shops={shops} />
    </div>
  );
}

export default ShopButton;
