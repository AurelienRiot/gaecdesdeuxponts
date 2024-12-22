import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateProducts(mainProductId?: string) {
  revalidateTag("products");
  revalidateTag("categories");
  revalidatePath("/category", "layout");
}

export function revalidateCategories(categoryId?: string) {
  revalidateTag("categories");
  revalidateTag("products");
  revalidatePath(`/category/${categoryId}`);
}

export function revalidateShops(shopId?: string) {
  revalidateTag("shops");
  revalidatePath("/");
  revalidatePath(`/ou-nous-trouver`);
  shopId && revalidatePath(`/ou-nous-trouver/${shopId}`);
}

export function revalidateAmap() {
  revalidateTag("amapOrders");
  revalidatePath("/admin/calendar");
}

export function revalidateUsers(userId?: string) {
  revalidateTag("users");
}

export function revalidateOrders() {
  revalidateTag("orders");
}

export function revalidateInvoices() {
  revalidateTag("invoices");
}

export function revalidateFavoriteProducts() {
  revalidateTag("favoriteProducts");
}

export function revalidateDefaultOrders() {
  revalidateTag("defaultOrders");
}

export function revalidateStocks(type: "stocks" | "stocksName") {
  if (type === "stocks") {
    revalidateTag("stocks");
  } else {
    revalidateTag("stocksName");
    revalidateTag("stocks");
  }
}
