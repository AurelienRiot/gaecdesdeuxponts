import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);
const reducedAlphabet = customAlphabet("abcdefghijklmnopqrstuv0123456789", 17);

export const IdType = ["category", "product", "user", "shop", "mainProduct", "order", "amap", "command"] as const;

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
    case "order":
      return `CM_${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear() % 100}_${nanoid(5)}`;
    case "amap":
      return `AM_${nanoid(7)}`;
    case "command":
      return `commandes${reducedAlphabet()}`;
  }
}

export function createInvoiceId(date: Date, previousId?: string) {
  const year = date.getFullYear();
  const previousNumber = previousId ? Number(previousId.split("_")[2]) : 1;
  const newNumber = previousNumber + 1;
  return `FA_${year}_${newNumber.toString().padStart(3, "0")}`;
}
