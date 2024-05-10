"use client";

import useCart from "@/hooks/use-cart";
import { ProductWithOptionsAndMain } from "@/types";
import { Button, IconButton } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

const AddToCartButton = ({
  data,
  quantity,
  type,
  className,
  iconClassName,
}: {
  data: ProductWithOptionsAndMain;
  quantity?: number;
  className?: string;
  iconClassName?: string;
  type: "text" | "icon";
}) => {
  const { addItem } = useCart();

  const onAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    addItem(
      {
        ...data,
        imagesUrl: data.imagesUrl[0] ? data.imagesUrl : data.product.imagesUrl,
      },
      quantity,
    );
  };

  if (type === "icon") {
    return (
      <IconButton
        className={cn(
          "z-20 size-10 sm:opacity-0 sm:group-hover:opacity-100",
          className,
        )}
        iconClassName={iconClassName}
        title="Ajouté au panier"
        onClick={onAddToCart}
        Icon={ShoppingCart}
      />
    );
  }
  return (
    <Button
      variant="rounded"
      className={cn("flex items-center gap-x-2 hover:scale-105", className)}
      onClick={onAddToCart}
    >
      Ajouter au panier
      <ShoppingCart className={iconClassName} />
    </Button>
  );
};

export const CustomQuantityAddToCart = ({
  data,
  custom = false,
  onChange,
}: {
  data: ProductWithOptionsAndMain;
  custom?: boolean;
  onChange?: () => void;
}) => {
  const [customQuantity, setCustomQuantity] = useState(custom);
  const cart = useCart();
  const quantity = cart.quantities[data.id];

  const handleQuantity = (qty: number) => {
    if (!quantity) {
      cart.addItem(
        {
          ...data,
          imagesUrl: data.imagesUrl[0]
            ? data.imagesUrl
            : data.product.imagesUrl,
        },
        qty,
      );
    } else {
      cart.changeQuantity(data.id, qty);
    }
    if (onChange && qty > 0) onChange();
  };

  return (
    <div className="flex items-center gap-2 tabular-nums	">
      {customQuantity ? (
        <CustomQuantity
          id={data.id}
          setCustomQuantity={setCustomQuantity}
          handleQuantity={handleQuantity}
        />
      ) : (
        <Select
          onValueChange={(value) => {
            if (value === "0") {
              cart.removeItem(data.id);
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
              {"Personnalisé"}
            </SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

const CustomQuantity = ({
  setCustomQuantity,
  id,
  handleQuantity,
}: {
  id: string;
  setCustomQuantity: Dispatch<SetStateAction<boolean>>;
  handleQuantity: (qty: number) => void;
}) => {
  const { quantities } = useCart();
  const formSchema = z.object({
    quantity: z.coerce
      .number({
        required_error: "Veuillez entrer un nombre",
        invalid_type_error: "Veuillez entrer un nombre",
      })
      .min(0.1, { message: "Veuillez entrer une quantité supérieur à 0.1" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: quantities[id] || 1,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    handleQuantity(parseFloat(data.quantity.toFixed(1)));
    setCustomQuantity(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end gap-2"
      >
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="w-20">
              <FormMessage className="whitespace-nowrap" />
              <FormControl>
                <Input
                  placeholder="Quantité"
                  className="w-20"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(",", "."))
                  }
                />
              </FormControl>
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

export default AddToCartButton;
