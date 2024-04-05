import {
  Address,
  Category,
  Image,
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

export type ProductWithImages = Product & {
  images: Image[];
};
export type ProductWithCategoryAndImages = Product & {
  images: Image[];
  category: Category;
};

export type ProductWithCategoryImagesAndLinkedProducts = Product & {
  images: Image[];
  category: Category;
  linkedBy: { id: string; name: string }[];
  linkedProducts: { id: string; name: string }[];
};

export type UserWithOrders = User & {
  orders: Order[];
};
export type UserWithOrdersAndAdress = User & {
  orders: (Order & { orderItems: OrderItem[]; shop: Shop })[];
  address: Address[];
};
