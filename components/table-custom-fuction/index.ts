import type { OrderItem } from "@prisma/client";
import { getUnitLabel } from "../product/product-function";

const getUserName = (user: { name?: string | null; company?: string | null; email?: string | null }) =>
  user.company || user.name || user.email?.split("@")[0] || "";

function createProductList(items: OrderItem[]) {
  return items.map((item) => {
    const name = item.name;
    if (item.quantity !== 1) {
      return {
        name,
        price: item.price,
        quantity: `${item.quantity}`,
        unit: getUnitLabel(item.unit).quantity || undefined,
      };
    }
    return { name, price: item.price, quantity: "", unit: undefined };
  });
}

export { getUserName, createProductList };
