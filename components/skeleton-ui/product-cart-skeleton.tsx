import IconButton from "@/components/ui/icon-button";
import { ShoppingCart } from "lucide-react";
import { FaInfo } from "react-icons/fa";
import { Skeleton } from "./skeleton";
import Currency from "../ui/currency";

export const ProductCart = () => {
  return (
    <div className="group m-2 w-52  cursor-pointer space-y-4 rounded-xl border bg-secondary p-3 transition-transform ">
      <div className="relative aspect-square rounded-xl bg-white before:absolute before:inset-0 before:z-10 before:rounded-xl before:bg-black/20 before:opacity-0 before:duration-300 before:ease-linear before:animate-in group-hover:before:opacity-100 ">
        <Skeleton className=" h-full w-full rounded-xl"></Skeleton>
        <div className="absolute bottom-5 w-full px-6  ">
          <div className="flex justify-center gap-x-6">
            <IconButton
              className="z-20 sm:opacity-0 sm:group-hover:opacity-100"
              title="Aperçue"
              icon={<FaInfo size={20} className="text-foreground" />}
            />
            <IconButton
              className="z-20 sm:opacity-0 sm:group-hover:opacity-100"
              title="Ajouté au panier"
              icon={<ShoppingCart size={20} className="text-foreground" />}
            />
          </div>
        </div>
      </div>

      <div>
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center justify-between text-primary">
        <Currency />
      </div>
    </div>
  );
};
