"use client";

import { DisplayProductIcon } from "@/components/product";
import { IconButton } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import useServerAction from "@/hooks/use-server-action";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { Grip, ListOrdered } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { useRaisedShadow } from "../../../calendar/_components/use-raised-shadow";
import updateProductsIndex from "../_actions/update-products-index";
import type { ProductFormValues } from "./product-schema";

function ReorderProducts({
  products,
}: {
  products: ProductFormValues[];
}) {
  const [localProducts, setLocalProducts] = useState(products.map((p) => p.id));
  const [open, setOpen] = useState(false);
  const { serverAction } = useServerAction(updateProductsIndex);
  const router = useRouter();

  function onClose() {
    const newOrder = products.map((p) => ({ index: localProducts.indexOf(p.id), productId: p.id }));
    setOpen(false);
    serverAction({
      data: newOrder,
      onSuccess: () => {
        router.refresh();
      },
    });
  }

  useEffect(() => {
    if (!products) return;
    setLocalProducts(products.map((p) => p.id));
  }, [products]);
  if (!products || products.length < 2) return null;

  return (
    <>
      <IconButton iconClassName="size-3" onClick={() => setOpen(true)} Icon={ListOrdered} />
      <Modal title="Option" isOpen={open} onClose={onClose}>
        <Reorder.Group
          as="ul"
          values={localProducts}
          onReorder={setLocalProducts}
          className="flex flex-col gap-2   relative max-h-[70dvh] p-2"
          style={{ overflowY: "scroll" }}
          axis="y"
          layoutScroll
        >
          {localProducts.map((id) => {
            const product = products.find((o) => o.id === id);
            if (!product) return null;
            return <MemoizedOrderProduct key={product.id} product={product} />;
          })}
        </Reorder.Group>
      </Modal>
    </>
  );
}

const MemoizedOrderProduct = memo(OrderProduct);

function OrderProduct({ product }: { product: ProductFormValues }) {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  const controls = useDragControls();

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    controls.start(e);
  };

  return (
    <Reorder.Item
      style={{ boxShadow, y }}
      value={product.id}
      id={product.id}
      dragListener={false}
      dragControls={controls}
      as="li"
      className={`p-2 border rounded-md flex gap-2 transition-colors bg-background`}
    >
      <div
        onPointerDown={handlePointerDown}
        style={{ touchAction: "none" }}
        className="flex gap-2 items-center justify-center p-2 cursor-pointer"
      >
        <Grip className="size-4" />
      </div>

      <span className="p-2 select-none pointer-events-none">
        <DisplayProductIcon icon={product.icon} />
        {product.name}
      </span>
    </Reorder.Item>
  );
}

export default ReorderProducts;
