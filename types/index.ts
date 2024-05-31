import {
  Address,
  MainProduct,
  Option as OptionType,
  Order,
  OrderItem,
  Product,
  Shop,
  User,
} from "@prisma/client";

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export interface DataTableFilterOption<TData> {
  id?: string;
  label: string;
  value: keyof TData | string;
  items: Option[];
  isMulti?: boolean;
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData;
  title: string;
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[];
}

export interface DataTableViewOptionsColumn<TData> {
  id: keyof TData;
  title: string;
}
export interface ProductWithMain extends Product {
  product: MainProduct;
}

export interface ProductWithOptionsAndMain extends ProductWithMain {
  options: OptionType[];
}

export interface ProductWithOptions extends Product {
  options: OptionType[];
}

export interface UserWithOrders extends User {
  orders: Order[];
}

export interface UserWithAddress extends User {
  address: Address | null;
  billingAddress: Address | null;
}
export interface UserWithOrdersAndAdress extends User {
  orders: (Order & {
    orderItems: OrderItem[];
    shop: Shop | null;
  })[];
  address: Address | null;
  billingAddress: Address | null;
}

export interface OrderWithItemsAndShop extends Order {
  orderItems: OrderItem[];
  shop: Shop | null;
}

export interface OrderWithItemsAndUserAndShop extends OrderWithItemsAndShop {
  user: UserWithAddress;
}

export interface MainProductWithProducts extends MainProduct {
  products: ProductWithOptions[];
}

export type ReturnTypeServerAction<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
    };
