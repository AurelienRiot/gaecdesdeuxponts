import Container from "@/components/ui/container";
import Summary from "./components/summary";
import CartItems from "./components/cart-items";
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/auth/authOptions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmailButton, GoogleButton } from "../(auth)/login/page";

const baseUrl = process.env.NEXT_PUBLIC_URL;

const CartPage = async () => {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;

  return (
    <Container>
      <div className="px-2 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold ">Pannier</h1>
        <div className="mt-12 gap-x-12 lg:grid lg:grid-cols-12 lg:items-start">
          <CartItems />
          <Summary userId={userId} />
        </div>
        {!userId && <LoginCard />}
      </div>
    </Container>
  );
};

export default CartPage;

const LoginCard = () => {
  return (
    <Card className="mt-6 max-w-[500px]">
      <CardHeader className="text-center text-2xl font-semibold ">
        Connecter vous pour valider votre commande
      </CardHeader>
      <CardContent className="flex  flex-col items-center justify-center">
        <GoogleButton callbackUrl={baseUrl + "/cart"} />
        <div
          className={`my-4 flex h-4 flex-row  items-center gap-4 self-stretch whitespace-nowrap
before:h-0.5 before:w-full 
before:flex-grow before:bg-primary/30  after:h-0.5  after:w-full 
after:flex-grow  after:bg-primary/30  `}
        >
          ou
        </div>
        <EmailButton callbackUrl={baseUrl + "/cart"} />
      </CardContent>
    </Card>
  );
};
