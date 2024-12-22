"use client";
import AuthLink from "@/components/navbar-public/auth-link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_URL;
const LoginCard = ({
  className,
}: {
  className?: string;
}) => {
  const searchParams = useSearchParams();

  return (
    <Card className={cn("mt-6 flex  max-w-[500px] flex-col justify-between", className)}>
      <CardHeader className="text-center text-2xl font-semibold ">Connecté vous pour valider votre commande</CardHeader>
      <CardContent className="flex  flex-col items-center justify-center">
        <AuthLink callbackUrl={encodeURIComponent(baseUrl + "/panier?" + searchParams.toString())} />
      </CardContent>
    </Card>
  );
};

export default LoginCard;
