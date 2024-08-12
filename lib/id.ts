import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);

export const IdType = ["category", "product", "user", "shop", "mainProduct", "order", "amap"] as const;

export function createId(type: (typeof IdType)[number]) {
  switch (type) {
    case "category":
      return `CT_${nanoid(7)}`;
    case "product":
      return `PR_${nanoid(7)}`;
    case "user":
      return `CS_${nanoid(7)}`;
    case "shop":
      return `SH_${nanoid(7)}`;
    case "mainProduct":
      return `MP_${nanoid(7)}`;
    case "order":
      return `CM_${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear() % 100}_${nanoid(5)}`;
    case "amap":
      return `CA_${nanoid(7)}`;
  }
}
