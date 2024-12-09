import { Icons } from "../icons";
import { BsBasketFill, LuMilk, PiPackageDuotone, TbMilk } from "../react-icons";

export type OptionsArray = {
  name: string;
  values: string[];
}[];

export const productIcons = [
  { label: "bouteille blue", Icon: LuMilk, color: "text-blue-500" },
  { label: "pie vache blue", Icon: Icons.CowMilk, color: "fill-blue-500" },
  { label: "bouteille grise", Icon: LuMilk, color: "text-gray-500" },
  { label: "bidon verre", Icon: TbMilk, color: "text-green-700" },
  { label: "casier rouge", Icon: BsBasketFill, color: "text-red-500" },
  { label: "package", Icon: PiPackageDuotone, color: "text-gray-500" },
];

export const DisplayProductIcon = ({ icon }: { icon?: string | null }) => {
  const productIcon = productIcons.find((product) => product.label === icon);
  const color = productIcon ? productIcon.color : "text-gray-500";
  const Icon = productIcon ? productIcon.Icon : PiPackageDuotone;
  return <Icon className={`size-5 shrink-0 ${color}`} />;
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
        .replace(",", "./react-icons");
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
