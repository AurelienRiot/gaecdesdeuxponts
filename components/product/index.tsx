import { BsBasketFill } from "react-icons/bs";
import { LuMilk } from "react-icons/lu";
import { PiPackageDuotone } from "react-icons/pi";
import { TbMilk } from "react-icons/tb";
import { Icons } from "../icons";

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
