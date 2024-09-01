import Container from "@/components/ui/container";
import type { Shop } from "@prisma/client";
import { Suspense } from "react";
import CartItems from "./_components/cart-items";
import Summary from "./_components/summary";
import { addDelay } from "@/lib/utils";

export const dynamic = "force-static";

const CartPage = async () => {
  // const shops = await getShops();
  const shops = [] as Shop[];

  return (
    <Container>
      <div className="px-2 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Panier</h1>
        <div className="mt-12 gap-x-12 lg:grid lg:grid-cols-12 lg:items-start">
          <CartItems />

          <Suspense fallback={<div>Loading...</div>}>
            <Summary shops={shops} />
          </Suspense>
        </div>
      </div>
    </Container>
  );
};

export default CartPage;
