import type { ShopType } from "@prisma/client";
import type { Option } from "../ui/multiple-selector";
import {
  FaCarrot,
  FaConciergeBell,
  GiBread,
  GiCupcake,
  GiHorseHead,
  GiPig,
  GiVendingMachine,
  IoRestaurantSharp,
  LuCigarette,
  LuCoffee,
  MdLocalBar,
  MdOutlineStorefront,
  PiBasket,
  PiFarm,
} from "../react-icons";

export const typeTextRecord: Record<ShopType, string> = {
  sell: "Acheter nos produits",
  product: "Acheter les produits fais avec notre lait",
  amap: "Commander nos produits laitiers",
  both: "Acheter nos produits ainsi que les produits fait avec notre lait",
};

export const tagOptions: Option[] = [
  { label: "Bar", value: "bar", Icon: MdLocalBar },
  { label: "Épicerie", value: "epicerie", Icon: MdOutlineStorefront },
  { label: "Ferme", value: "ferme", Icon: PiFarm },
  { label: "Tabac", value: "tabac", Icon: LuCigarette },
  { label: "Café", value: "cafe", Icon: LuCoffee },
  { label: "Boulangerie", value: "boulangerie", Icon: GiBread },
  { label: "Pâtisserie", value: "patisserie", Icon: GiCupcake },
  { label: "AMAP", value: "amap", Icon: PiBasket },
  { label: "Restaurant", value: "restaurant", Icon: IoRestaurantSharp },
  { label: "Traiteur", value: "caterer", Icon: FaConciergeBell },
  { label: "Boucherie Charcuterie", value: "butcher", Icon: GiPig },
  { label: "Marché", value: "market", Icon: FaCarrot },
  { label: "Distributeur", value: "distributeur", Icon: GiVendingMachine },
  { label: "PMU", value: "pmu", Icon: GiHorseHead },
];
