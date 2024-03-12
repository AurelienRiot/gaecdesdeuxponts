"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface OrderStatusContextType {
  orderStatus: { [key: string]: boolean | "indeterminate" };
  setOrderStatus: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean | "indeterminate" }>
  >;
}
const OrderStatusContext = createContext<OrderStatusContextType | undefined>(
  undefined,
);

type OrderStatusProviderProps<T = {}> = {
  initialData: T &
    {
      id: string;
      isPaid: boolean;
    }[];
  children: ReactNode;
};

export const OrderStatusProvider = <T,>({
  initialData,
  children,
}: OrderStatusProviderProps<T>) => {
  const [orderStatus, setOrderStatus] = useState<{
    [key: string]: boolean | "indeterminate";
  }>(
    initialData.reduce(
      (acc, order) => {
        acc[order.id] = order.isPaid;
        return acc;
      },
      {} as { [key: string]: boolean | "indeterminate" },
    ) || {},
  );

  return (
    <OrderStatusContext.Provider value={{ orderStatus, setOrderStatus }}>
      {children}
    </OrderStatusContext.Provider>
  );
};

export function useOrderStatusContext() {
  const context = useContext(OrderStatusContext);

  if (context === undefined) {
    throw new Error(
      "useOrderStatusContext must be used within an OrderStatusProvider",
    );
  }

  return context;
}
