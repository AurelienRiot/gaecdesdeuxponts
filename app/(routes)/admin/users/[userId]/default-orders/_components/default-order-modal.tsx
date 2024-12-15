"use client";
import type { AllShopsType } from "@/app/(routes)/admin/direction/_functions/get-shops";
import type { ProductsForOrdersType } from "@/app/(routes)/admin/orders/[orderId]/_functions/get-products-for-orders";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import type { UserForOrderType } from "@/components/zod-schema/user-for-orders-schema";
import { useUsersQueryClient } from "@/hooks/use-query/users-query";
import useServerAction from "@/hooks/use-server-action";
import { DAYS_OF_WEEK } from "@/lib/date-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import updateDefaultOrdersAction from "../_actions/update-default-orders";
import type { GetDefaultOrdersType } from "../_functions/get-default-orders";
import DisplayDefaultOrderForTheDay from "./display-default-order-for-the-day";
import { type DefaultOrderFormValues, defaultOrderSchema } from "./schema";
import NoResults from "@/components/ui/no-results";
import { DisplayProductIcon } from "@/components/product";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, currencyFormatter } from "@/lib/utils";
import { displayQuantity } from "@/components/google-events";

type DefaultOrderProps = Omit<NonNullable<GetDefaultOrdersType>["defaultOrders"][number], "id">;

type DefaultOrderContextType = {
  defaultOrder: DefaultOrderProps | null;
  setDefaultOrder: React.Dispatch<React.SetStateAction<DefaultOrderProps | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DefaultOrderModalContext = createContext<DefaultOrderContextType | undefined>(undefined);

export const DefaultOrderModalProvider: React.FC<{
  children: React.ReactNode;
  products: ProductsForOrdersType;
  shops: AllShopsType;
  favoriteProducts: string[];
}> = ({ children, products, shops, favoriteProducts }) => {
  const [defaultOrder, setDefaultOrder] = useState<DefaultOrderProps | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <DefaultOrderModalContext.Provider value={{ defaultOrder, setDefaultOrder, open, setOpen }}>
      {children}
      <DefaultOrderModal products={products} shops={shops} favoriteProducts={favoriteProducts} />
    </DefaultOrderModalContext.Provider>
  );
};

export function useDefaultOrderModal() {
  const context = useContext(DefaultOrderModalContext);

  if (context === undefined) {
    throw new Error("useDefaultOrderModal must be used within a DefaultOrderModalProvider");
  }

  return context;
}

function DefaultOrderModal({
  products,
  shops,
  favoriteProducts,
}: { products: ProductsForOrdersType; shops: AllShopsType; favoriteProducts: string[] }) {
  const { defaultOrder, open, setOpen } = useDefaultOrderModal();
  const { serverAction } = useServerAction(updateDefaultOrdersAction);
  const { mutateUsers } = useUsersQueryClient();
  // const [localDayOrdersForDay, setLocalDayOrdersForDay] = useState(
  //   userForTheDay?.dayOrderUsers.map(({ userId }) => userId),
  // );

  const form = useForm<DefaultOrderFormValues>({
    resolver: zodResolver(defaultOrderSchema),
    defaultValues: {
      day: defaultOrder?.day,
      confirmed: defaultOrder?.confirmed ?? true,
      userId: defaultOrder?.userId,
      shopId: defaultOrder?.shopId,
      defaultOrderProducts:
        defaultOrder?.defaultOrderProducts.map(({ price, productId, quantity }) => ({
          productId,
          price,
          quantity,
        })) || [],
    },
  });

  useEffect(() => {
    form.reset({
      day: defaultOrder?.day,
      confirmed: defaultOrder?.confirmed ?? true,
      userId: defaultOrder?.userId,
      shopId: defaultOrder?.shopId,
      defaultOrderProducts:
        defaultOrder?.defaultOrderProducts.map(({ price, productId, quantity }) => ({
          productId,
          price,
          quantity,
        })) || [],
    });
  }, [defaultOrder, form.reset]);

  function onClose() {
    if (!defaultOrder) {
      toast.error("Veuillez sélectionner au moins un client");
      return;
    }
    setOpen(false);
    onSubmit(form.getValues());
  }

  async function onSubmit(data: DefaultOrderFormValues) {
    if (data.defaultOrderProducts.length > 0 && !data.defaultOrderProducts.every((item) => item.productId)) {
      toast.error("Completer tous les produits deja existant");
      setOpen(true);
      return;
    }
    function onSuccess(result?: number[]) {
      if (result) {
        mutateUsers((users) =>
          users.map((user) => (user.id === data.userId ? { ...user, defaultDaysOrders: result } : user)),
        );
      }
    }
    serverAction({ data, onSuccess });
  }
  return (
    <Modal title="Information du client" className="p-4 max-h-[95vh] h-full " isOpen={open} onClose={onClose}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[320px] mx-auto h-full  space-y-4 relative flex-shrink-0"
        >
          {defaultOrder ? (
            <DisplayDefaultOrderForTheDay
              day={defaultOrder.day}
              favoriteProducts={favoriteProducts}
              products={products}
              shops={shops}
            />
          ) : (
            <NoResults />
          )}
        </form>
      </Form>
    </Modal>
  );
}

export function ModalTrigger({
  day,
  defaultOrder,
  products,
}: {
  day: number;
  defaultOrder: DefaultOrderProps;
  products: { name: string; icon: string; quantity: number; price: number; id: string; unit?: string | null }[];
}) {
  const { setOpen, setDefaultOrder } = useDefaultOrderModal();

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <Button
          className="w-40 mx-auto "
          variant={"outline"}
          onClick={() => {
            setDefaultOrder(defaultOrder);
            setOpen(true);
          }}
        >
          {DAYS_OF_WEEK[day]}
        </Button>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <ul className="flex gap-2 justify-center  flex-wrap">
            {products.map((p) => (
              <li key={p.id} className="flex gap-1 bg-gray-100 p-2 rounded-sm">
                <DisplayProductIcon icon={p.icon} />
                <p className={cn("text-sm font-medium  ", p.quantity < 0 ? "text-red-500" : "text-gray-700")}>
                  <span className="font-bold">{p.quantity}</span> x {p.name} : {currencyFormatter.format(p.price)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <NoResults text="Aucun produit" />
        )}
      </CardContent>
    </Card>
  );
}
