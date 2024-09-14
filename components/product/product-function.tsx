import type { ProductWithOptionsAndMain } from "@/types";
import type { Option, Unit } from "@prisma/client";

export const priorityMap: { [key: string]: number } = {
  "Lait cru bouteille verre 1L consignée": 1,
  "Lait cru vrac": 2,
  "Consigne bouteille verre 1L": 3,
  "Lait cru bouteille verre 1L": 4,
};
export type OptionsArray = {
  name: string;
  values: string[];
}[];

export function hasOptionWithValue<T extends { name: string; value: string }[]>(options: T, value: string): boolean {
  return options.some((option) => option.value === value);
}
export function makeCategoryUrl(categoryName: string, isPro: boolean) {
  return isPro ? `/dashboard-user/produits-pro/category/${categoryName}` : `/category/${categoryName}`;
}

export function makeOptionsUrl(options: Option[], parsing?: boolean) {
  let url = "";
  options.forEach((option, index) => {
    url += `${option.name}=${encodeURIComponent(option.value)}`;
    if (index < options.length - 1) {
      url += parsing ? "&amp;" : "&";
    }
  });
  if (url) {
    url = "?" + url;
  }
  return url;
}

export function makeProductUrl({
  productName,
  categoryName,
  isPro,
  options,
  parsing,
}: {
  productName: string;
  categoryName: string;
  isPro: boolean;
  options?: Option[];
  parsing?: boolean;
}) {
  const categoryUrl = makeCategoryUrl(categoryName, isPro);
  const url =
    options && options.length > 0
      ? `${categoryUrl}/product/${encodeURIComponent(productName)}${makeOptionsUrl(options, parsing)}`
      : `${categoryUrl}/product/${encodeURIComponent(productName)}`;
  return url;
}

export function getUnitLabel(value?: Unit | string | null) {
  if (!value) return { price: "", quantity: "", type: "" };
  switch (value) {
    case "centgramme":
      return { price: "pour 100g", quantity: "x 100g", type: "poids" };
    case "Kilogramme":
      return { price: "par kilogramme", quantity: "kg", type: "poids" };
    case "Litre":
      return { price: "le litre", quantity: "L", type: "volume" };
    default:
      return { price: value, quantity: value, type: value };
  }
}

export function findProduct({
  products,
  optionsArray,
  searchParams,
}: {
  products: ProductWithOptionsAndMain[];
  optionsArray: OptionsArray;
  searchParams: { [key: string]: string | undefined };
}): ProductWithOptionsAndMain | undefined {
  const optionsValue = optionsArray.map((option) => {
    return { name: option.name, value: searchParams[option.name] };
  });
  return products.find((product) => {
    return optionsValue.every(({ name, value }, index) => {
      return !value || product.options.find((option) => option.name === name)?.value === value;
    });
  });
}

export const getAllOptions = (
  options: {
    name: string;
    value: string;
  }[],
) => {
  const groupedOptions = options.reduce<Record<string, string[]>>((acc, option) => {
    if (!acc[option.name]) {
      acc[option.name] = [];
    }
    if (!acc[option.name].includes(option.value)) {
      acc[option.name].push(option.value);
    }
    return acc;
  }, {});

  const mappedGroupedOptions: OptionsArray = Object.entries(groupedOptions).map(([key, value]) => ({
    name: key,
    values: value,
  }));

  return mappedGroupedOptions;
};
