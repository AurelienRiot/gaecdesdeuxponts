import { Option, Unit } from "@prisma/client";

export function hasOptionWithValue<T extends { name: string; value: string }[]>(
  options: T,
  value: string,
): boolean {
  return options.some((option) => option.value === value);
}
export function makeCategoryUrl(categoryName: string, isPro: boolean) {
  return isPro
    ? `/dashboard-user/produits-pro/category/${categoryName}`
    : `/category/${categoryName}`;
}

export function makeOptionsUrl(options: Option[]) {
  let url = "?";
  options.forEach((option) => {
    url += `${option.name}=${encodeURIComponent(option.value)}&`;
  });
  return url;
}

export function makeProductUrl(
  productName: string,
  categoryName: string,
  isPro: boolean,
  options?: Option[],
) {
  const categoryUrl = makeCategoryUrl(categoryName, isPro);
  const url =
    options && options.length > 0
      ? `${categoryUrl}/product/${encodeURIComponent(productName)}${makeOptionsUrl(options)}`
      : `${categoryUrl}/product/${encodeURIComponent(productName)}`;
  return url;
}

export function getUnitLabel(value?: Unit | null) {
  if (!value) return { price: "", quantity: "", type: "" };
  switch (value) {
    case "centgramme":
      return { price: "pour 100g", quantity: "x 100g", type: "poids" };
    case "Kilogramme":
      return { price: "par kilogramme", quantity: "kg", type: "poids" };
    case "Litre":
      return { price: "par litre", quantity: "L", type: "volume" };
    default:
      return { price: value, quantity: value, type: value };
  }
}
