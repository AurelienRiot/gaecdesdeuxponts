import { Icons } from "../icons";
import { TbMilk, BsBasketFill, PiPackageDuotone, LuMilk } from "../react-icons";

export const priorityMap: { [key: string]: number } = {
  "Lait cru bouteille verre 1L consignée": 1,
  "Lait cru bidon 5L": 3,
  "Consigne bouteille verre 1L": 4,
  "Lait cru bouteille verre 1L": 2,
};
export const biocoopProducts = ["Lait cru bio 1L", "Bouteille verre 1L"];

export type OptionsArray = {
  name: string;
  values: string[];
}[];

const productIcons = [
  { label: "lait cru bouteille verre", Icon: LuMilk, color: "text-blue-500" },
  { label: "lait cru bio 1l", Icon: Icons.CowMilk, color: "fill-blue-500" },
  { label: "lait cru vrac", Icon: Icons.CowMilk, color: "fill-blue-500" },
  { label: "bouteille", Icon: LuMilk, color: "text-gray-500" },
  { label: "bidon", Icon: TbMilk, color: "text-green-700" },
  { label: "casier", Icon: BsBasketFill, color: "text-red-500" },
];

export const DisplayProductIcon = ({ name }: { name: string }) => {
  const productName = name.toLowerCase();

  for (const product of productIcons) {
    if (productName.includes(product.label)) {
      return <product.Icon className={`h-5 w-5 ${product.color}`} />;
    }
  }
  return <PiPackageDuotone className="h-5 w-5 text-gray-500" />;
};

export function getTotalMilk(products: { name: string; quantity: number }[]) {
  return products.reduce((acc, curr) => {
    const liter = extractLiters(curr.name);
    const coef = curr.name.includes("Casier") ? 12 : 1;
    if (liter) {
      return acc + liter * curr.quantity * coef;
    }
    return acc;
  }, 0);
}

function extractLiters(productName: string): number | null {
  try {
    if (productName.includes("vrac")) return 1;
    const regex = /\b(\d+([.,]\d+)?\s?(L|liter|litre|liters|litres|cl))\b/i;
    const match = productName.match(regex);
    if (match) {
      const numberString = match[1]
        .replace(/[Ll]iter(s)?|cl/i, "")
        .trim()
        .replace(",", ".");
      let number = Number.parseFloat(numberString);
      if (match[3].toLowerCase() === "cl") {
        number /= 100; // Convert centiliters to liters
      }
      return Number.isNaN(number) ? null : number;
    }
    return null;
  } catch (error) {
    console.error(`Error extracting liters from "${productName}":`, error);
    return null;
  }
}

export function getPriceMinusConsigne(products: { name: string; quantity: number; tax: number; price: number }[]) {
  const totalMilkBottes = products
    .filter((product) => product.name.toLowerCase().includes("lait cru bouteille verre") && product.price > 1)
    .reduce((acc, curr) => acc + curr.quantity, 0);
  const totalPrice =
    products.reduce((acc, curr) => acc + (curr.price * curr.quantity) / curr.tax, 0) - totalMilkBottes * 0.47;
  return totalPrice;
}
