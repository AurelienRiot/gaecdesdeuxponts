"use client";

import useCart from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import type { ProductWithOptionsAndMain } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingCart } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button, IconButton } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input, NumberInput } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { getUnitLabel } from "./product-function";

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
        className={cn("z-20 size-10 sm:opacity-0 sm:group-hover:opacity-100", className)}
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
          imagesUrl: data.imagesUrl[0] ? data.imagesUrl : data.product.imagesUrl,
        },
        qty,
      );
    } else {
      cart.changeQuantity(data.id, qty);
    }
    if (onChange && qty > 0) onChange();
  };

  return (
    <div className="flex items-center gap-2 tabular-nums">
      {customQuantity ? (
        <CustomQuantity id={data.id} setCustomQuantity={setCustomQuantity} handleQuantity={handleQuantity} />
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
          <SelectTrigger className="w-fit items-center justify-center text-xs tabular-nums" classNameIcon="size-3">
            Quantité: {quantity}
          </SelectTrigger>
          <SelectContent className="z-[1200] w-fit min-w-4 tabular-nums">
            <SelectItem className="py-0.5 text-xs" value={"0"}>
              Supprimé
            </SelectItem>
            {[...Array(9)].map((_, i) => (
              <SelectItem className="py-0.5 text-xs" key={i} value={String(i + 1)}>
                {i + 1}
              </SelectItem>
            ))}
            <SelectItem className="py-0.5 text-xs" value={"10"}>
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
        invalid_type_error: "Veuillez entrer un nombre entier",
      })
      .int({ message: "Veuillez entrer un nombre entier" })
      .min(1, { message: "Veuillez entrer un nombre entier positif" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: quantities[id] || 1,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    handleQuantity(data.quantity);
    setCustomQuantity(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="w-20">
              <FormMessage className="whitespace-nowrap" />
              <FormControl>
                <NumberInput placeholder="Quantité" className="w-20" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting} className="ml-auto" type="submit">
          Valider
        </Button>
      </form>
    </Form>
  );
};

export const BulkQuantity = ({
  className,
  product,
  iconClassName,
}: {
  product: ProductWithOptionsAndMain;
  className?: string;
  iconClassName?: string;
}) => {
  const { quantities, addItem, changeQuantity } = useCart();
  const quantity = quantities[product.id] || undefined;
  const formSchema = z.object({
    quantity: z.coerce
      .number({
        required_error: "Veuillez entrer un nombre",
        invalid_type_error: "Veuillez entrer un nombre",
      })
      .min(0, { message: "Veuillez entrer un nombre positif" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const qty = Number(data.quantity.toFixed(1));
    if (quantity) {
      changeQuantity(product.id, qty);
      toast.success("Quantité modifiée");
    } else {
      if (data.quantity > 0) {
        addItem(product, qty);
      }
    }
    form.reset({ quantity: qty ? qty : undefined });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-4 pt-4">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="justify-left relative flex w-auto items-center gap-1 space-y-0">
              <FormMessage className="absolute -top-7 left-0 whitespace-nowrap" />

              <FormControl>
                <Input
                  placeholder={getUnitLabel(product.unit).type || "Quantité"}
                  className="w-[70px]"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value.replace(",", "."))}
                />
              </FormControl>
              <span className="flex h-full items-center justify-center">{getUnitLabel(product.unit).quantity}</span>
            </FormItem>
          )}
        />
        <Button variant="rounded" className={cn("flex items-center gap-x-2 hover:scale-105", className)} type="submit">
          {quantity ? "Modifier la quantité" : " Ajouter au panier"}
          <ShoppingCart className={cn("size-4", iconClassName)} />
        </Button>
      </form>
    </Form>
  );
};

export default AddToCartButton;
