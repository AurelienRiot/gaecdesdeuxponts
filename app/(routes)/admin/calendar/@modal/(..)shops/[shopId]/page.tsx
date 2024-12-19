import ShopForm from "@/app/(routes)/admin/shops/[shopId]/_components/shop-form";
import getShop from "@/app/(routes)/admin/shops/[shopId]/_functions/get-shop";
import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const dynamic = "force-dynamic";

async function IntercepteShopPage(
  props: {
    params: Promise<{ shopId: string }>;
    searchParams: Promise<{
      userId: string | undefined;
    }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const shop = await getShop({ params, searchParams });
  return (
    <div className="space-y-6 w-full">
      <SheetHeader className="sr-only">
        <SheetTitle>
          <span>Page Magasin</span>
        </SheetTitle>
        <SheetDescription className="">
          {params.shopId === "new" ? "Créer un magasin" : "Modifier le magasin"}
        </SheetDescription>
      </SheetHeader>
      <ShopForm initialData={shop} />
    </div>
  );
}

export default IntercepteShopPage;
