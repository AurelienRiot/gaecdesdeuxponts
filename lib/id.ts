import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);
const reducedAlphabet = customAlphabet("abcdefghijklmnopqrstuv0123456789", 17);

export const IdType = [
  "category",
  "product",
  "user",
  "shop",
  "mainProduct",
  "order",
  "amap",
  "command",
  "option",
  "orderItem",
] as const;

export function createId(type: (typeof IdType)[number], date?: Date | null) {
  const newDate = date ? new Date(date) : new Date();
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
    case "orderItem":
      return `OI_${nanoid(7)}`;
    case "option":
      return `OP_${nanoid(7)}`;
    case "order":
      return `CM_${newDate.getDate().toString().padStart(2, "0")}-${(newDate.getMonth() + 1).toString().padStart(2, "0")}-${newDate.getFullYear() % 100}_${nanoid(5)}`;
    case "amap":
      return `AM_${nanoid(7)}`;
    case "command":
      return `commandes${reducedAlphabet()}`;
  }
}

export const sanitizeId = (id: string) =>
  id
    .normalize("NFD")
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
