import getShops from "@/actions/get-shops";
import { authOptions } from "@/components/auth/authOptions";
import Container from "@/components/ui/container";
import { getServerSession } from "next-auth";
import CartItems from "./_components/cart-items";
import Summary from "./_components/summary";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const CartPage = async () => {
  const session = await getServerSession(authOptions);

  const shops = await getShops();
  const role = session?.user?.role;

  return (
    <Container>
      <div className="px-2 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold ">Panier</h1>
        <div className="mt-12 gap-x-12 lg:grid lg:grid-cols-12 lg:items-start">
          <CartItems />

          <Suspense fallback={<div>Loading...</div>}>
            <Summary role={role} shops={shops} />
          </Suspense>
        </div>
      </div>
    </Container>
  );
};

export default CartPage;
