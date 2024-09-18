"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useServerAction from "@/hooks/use-server-action";
import Link from "next/link";
import { useEffect, useState } from "react";
import { setShippedDay } from "../_actions/set-shipped-day";

function AmapCards({
  id,
  name,
  productsList,
  userId,
  shipped,
  shippedDay,
}: {
  name: string;
  userId: string;
  productsList: { name: string; quantity?: string; unit?: string }[];
  id: string;
  shipped: boolean;
  shippedDay: Date;
}) {
  const [checked, setChecked] = useState(shipped);
  const { serverAction, loading } = useServerAction(setShippedDay);

  const handleClick = async () => {
    setChecked((prev) => !prev);
    function onError() {
      setChecked((prev) => !prev);
    }
    await serverAction({
      data: {
        id,
        shippedDay,
        checked: !checked,
      },
      onError,
    });
  };

  useEffect(() => {
    setChecked(shipped);
  }, [shipped]);
  return (
    <Card className="w-full max-w-sm ">
      <CardHeader className="flex flex-row  items-center justify-between py-2 px-2 cursor-pointer">
        <Link href={`/admin/users/${userId}`} className="flex items-center gap-2 ">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 font-semibold text-xs">{name.charAt(0)}</span>
          </div>
          <span className="font-medium text-xs truncate">{name}</span>
        </Link>
        <Button asChild variant="outline" size="sm" className="h-6 text-xs px-2 ">
          <Link href={`/admin/amap/${id}`}>Éditer</Link>
        </Button>
      </CardHeader>
      <CardContent className="w-full px-4">
        <div className="grid grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold">Produits :</h4>
            <ul className="text-xs space-y-0.5">
              {productsList.map((product, index) => (
                <li key={index} className="flex justify-between">
                  <span>
                    {product.name}{" "}
                    {product.unit
                      ? `(${product.quantity}${product.unit})`
                      : product.quantity
                        ? `(x${product.quantity})`
                        : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Label
            className="flex items-center flex-col gap-4 cursor-pointer border p-2 rounded-sm bg-secondary"
            htmlFor={`validate-${id}`}
          >
            <span className="text-sm font-bold"> Valider la livraison</span>

            <Checkbox disabled={loading} id={`validate-${id}`} checked={checked} onCheckedChange={handleClick} />
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}

export default AmapCards;
