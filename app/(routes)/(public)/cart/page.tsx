import getShops from "@/actions/get-shops";
import { authOptions } from "@/components/auth/authOptions";
import Container from "@/components/ui/container";
import { getServerSession } from "next-auth";
import CartItems from "./components/cart-items";
import Summary from "./components/summary";

const CartPage = async () => {
  const session = await getServerSession(authOptions);

  const shops = await getShops();
  const userId = session?.user?.id;

  return (
    <Container>
      <div className="px-2 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold ">Pannier</h1>
        <div className="mt-12 gap-x-12 lg:grid lg:grid-cols-12 lg:items-start">
          <CartItems />

          <Summary userId={userId} shops={shops} />
        </div>
      </div>
    </Container>
  );
};

export default CartPage;
