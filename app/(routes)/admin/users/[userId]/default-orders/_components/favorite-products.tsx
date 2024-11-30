"use client";

import type { ProductsForOrdersType } from "@/app/(routes)/admin/orders/[orderId]/_functions/get-products-for-orders";
import { DisplayProductIcon } from "@/components/product";
import SelectSheetWithTabs, { getProductTabs } from "@/components/select-sheet-with-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import useServerAction from "@/hooks/use-server-action";
import { roundToDecimals } from "@/lib/utils";
import { useState } from "react";
import favoriteProductsAction from "../_actions/favorite-products-action";

function FavoriteProducts({
  products,
  userId,
  favoriteProducts,
}: { products: ProductsForOrdersType; userId: string; favoriteProducts: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [productIds, setProductIds] = useState<string[]>(favoriteProducts);
  const { serverAction } = useServerAction(favoriteProductsAction);

  const { tabsValues, tabs } = getProductTabs(
    products.filter((product) => !productIds.includes(product.id)),
    favoriteProducts,
  );
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Modifier les produits favoris</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          serverAction({ data: { userId, productIds }, onError: () => setIsOpen(true) });
          setIsOpen(false);
        }}
        title="Produits favoris"
        description="Définir les produits favoris"
      >
        <div className="space-y-4">
          <SelectSheetWithTabs
            triggerClassName="w-full"
            title="Selectionner un produit"
            trigger={"Ajouter un produit"}
            tabsValues={tabsValues}
            tabs={tabs}
            onSelected={(value) => {
              setProductIds((prev) => prev.concat(value.key));
            }}
          />
          {productIds.length > 0 &&
            productIds.map((productId) => {
              const product = products.find((product) => product.id === productId);
              if (!product) {
                return null;
              }
              return (
                <Button
                  key={product.id}
                  className="h-fit w-full"
                  variant={"outline"}
                  onClick={() => {
                    setProductIds((prev) => prev.filter((id) => id !== product.id));
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-2">
                      {product.product.isPro && (
                        <Badge variant="orange" className="mr-2">
                          Pro
                        </Badge>
                      )}
                      <DisplayProductIcon name={product.name} />
                      <span className="font-bold ">{product.name}</span>
                    </div>
                    <p className="ml-2">
                      {` ${roundToDecimals(product.price, 2)}€ TTC (${roundToDecimals(product.price / product.tax, 2)}€ HT)`}
                    </p>
                  </div>
                </Button>
              );
            })}
        </div>
      </Modal>
    </>
  );
}

export default FavoriteProducts;
