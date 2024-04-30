import { Address } from "@prisma/client";

export const addressFormatter = (address: Address) => {
  return `${address.line1}, ${address.postalCode}, ${address.city}`;
};
