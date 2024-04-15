"use client";

import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import useCart from "@/hooks/use-cart";
import { ProductWithCategoryAndImages } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

interface CartItemProps {
  data: ProductWithCategoryAndImages;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();
  const [customQuantity, setCustomQuantity] = useState(false);

  const value = Number(data.price);
  const quantity = cart.quantities[data.id];
  const url = data.isPro ? `/dashboard-user?tab=store&product=` : `/product/`;

  const onRemove = () => {
    cart.removeItem(data.id);
  };

  const handleQuantity = (quantity: number) => {
    cart.changeQuantity(data.id, quantity);
  };

  return (
    <>
      <div className="relative size-24  overflow-hidden rounded-md bg-white @sm:size-48 ">
        <Image
          fill
          src={data.images[0].url}
          sizes="100%"
          alt="image"
          className="object-cover object-center"
        />
      </div>
      <div className="@sm::ml-6 relative ml-4 flex flex-1 flex-col justify-between">
        <div className="absolute right-0 top-0 z-10">
          <IconButton
            type="button"
            className="bg-primary-foreground"
            onClick={onRemove}
            icon={<X size={15} className="text-primary" />}
          />
        </div>
        <div className="relative flex h-full flex-col content-center justify-between ">
          <div className="flex justify-between ">
            <Link
              href={url + encodeURIComponent(data.name)}
              className="pr-10 font-semibold text-primary @xs:text-lg"
            >
              {data.name}
            </Link>
          </div>
          <Currency value={value} />
          <div className="flex items-center gap-2 tabular-nums	">
            {customQuantity ? (
              <CustomQuantity
                id={data.id}
                setCustomQuantity={setCustomQuantity}
              />
            ) : (
              <Select
                onValueChange={(value) => {
                  if (value === "0") {
                    onRemove();
                    return;
                  }
                  if (value === "10") {
                    setCustomQuantity(true);
                    return;
                  }
                  handleQuantity(Number(value));
                }}
              >
                <SelectTrigger
                  className="w-fit items-center justify-center  text-xs tabular-nums"
                  classNameIcon="size-3"
                >
                  Quantité: {quantity}
                </SelectTrigger>
                <SelectContent className="w-fit min-w-4 tabular-nums">
                  <SelectItem className=" py-0.5 text-xs " value={"0"}>
                    Supprimé
                  </SelectItem>
                  {[...Array(9)].map((_, i) => (
                    <SelectItem
                      className=" py-0.5 text-xs "
                      key={i}
                      value={String(i + 1)}
                    >
                      {i + 1}
                    </SelectItem>
                  ))}
                  <SelectItem className=" py-0.5 text-xs" value={"10"}>
                    {"10+"}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;

const CustomQuantity = ({
  setCustomQuantity,
  id,
}: {
  id: string;
  setCustomQuantity: Dispatch<SetStateAction<boolean>>;
}) => {
  const { changeQuantity, quantities } = useCart();
  const formSchema = z.object({
    quantity: z.coerce
      .number({
        required_error: "Veuillez entrer un nombre",
        invalid_type_error: "Veuillez entrer un nombre",
      })
      .min(1, { message: "Veuillez entrer une quantité supérieur à 1" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: quantities[id] || 1,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    changeQuantity(id, data.quantity);
    setCustomQuantity(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Quantité"
                  className="w-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          className="ml-auto"
          type="submit"
        >
          Valider
        </Button>
      </form>
    </Form>
  );
};
