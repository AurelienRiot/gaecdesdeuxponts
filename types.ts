import { Category, Image, Order, Product, User } from "@prisma/client";

export type ProductWithCategoryAndImages = Product & {
  images: Image[];
  category: Category;
};

export type UserWithOrders = User & {
  orders: Order[];
};
