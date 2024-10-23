import { EmailButton, GoogleButton } from "@/components/auth/auth-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const baseUrl = process.env.NEXT_PUBLIC_URL;
const LoginCard = ({
  className,
  date,
  shopId,
}: {
  className?: string;
  date: Date | undefined;
  shopId: string | undefined;
}) => {
  let callbackUrl = baseUrl + "/panier";

  if (shopId) {
    callbackUrl += `?shopId=${encodeURIComponent(shopId)}`;
    if (date) {
      const dateString = encodeURIComponent(date.toISOString());
      callbackUrl += `&date=${dateString}`;
    }
  } else {
    if (date) {
      const dateString = encodeURIComponent(date.toISOString());
      callbackUrl += `?date=${dateString}`;
    }
  }

  return (
    <Card className={cn("mt-6 flex h-[450px] max-w-[500px] flex-col justify-between", className)}>
      <CardHeader className="text-center text-2xl font-semibold ">Connecté vous pour valider votre commande</CardHeader>
      <CardContent className="flex  flex-col items-center justify-center">
        <GoogleButton callbackUrl={callbackUrl} />
      </CardContent>
      <CardContent className="flex  flex-col items-center justify-center">
        <div
          className={`my-4 flex h-4 flex-row  items-center gap-4 self-stretch whitespace-nowrap
before:h-0.5 before:w-full 
before:flex-grow before:bg-primary/30  after:h-0.5  after:w-full 
after:flex-grow  after:bg-primary/30  `}
        >
          ou
        </div>
      </CardContent>
      <CardContent className="flex  flex-col items-center justify-center">
        <EmailButton callbackUrl={callbackUrl} />
      </CardContent>
    </Card>
  );
};

export default LoginCard;
