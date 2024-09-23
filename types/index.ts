import type {
  AMAPItem,
  AMAPOrder,
  Address,
  BillingAddress,
  Customer,
  Invoice,
  InvoiceOrder,
  InvoiceOrderItem,
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

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

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

export interface DataTableFilterableColumn<TData> extends DataTableSearchableColumn<TData> {
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
  billingAddress: BillingAddress | null;
}
export interface UserWithOrdersAndAdress extends User {
  orders: OrderWithItemsAndShop[];
  address: Address | null;
  billingAddress: BillingAddress | null;
}

export interface OrderWithItemsAndShop extends Order {
  orderItems: OrderItem[];
  shop: Shop | null;
}

export interface FullOrder extends OrderWithItemsAndShop {
  user: UserWithAddress;
}
export interface FullOrderWithInvoicePayment extends FullOrder {
  invoiceOrder: { invoice: { id: string; dateOfPayment: Date | null; invoiceEmail: Date | null } }[];
}

export interface MainProductWithProducts extends MainProduct {
  products: ProductWithOptions[];
}

export interface AMAPOrderWithItems extends AMAPOrder {
  amapItems: AMAPItem[];
}

export interface AMAPOrderWithItemsAndUser extends AMAPOrderWithItems {
  user: UserWithAddress;
}

export interface FullInvoice extends Invoice {
  customer: Customer | null;
  orders: InvoiceOrderWithItems[];
}
export interface InvoiceOrderWithItems extends InvoiceOrder {
  invoiceOrderItems: InvoiceOrderItem[];
}
