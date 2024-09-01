import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import type { Product, Shop } from "@prisma/client";
import { AMAPFormulaire } from "./amap-formulaire-form";

type AMAPFormulairePageProps = { shops: Shop[]; products: Product[] };
function AMAPFormulairePage({ shops, products }: AMAPFormulairePageProps) {
  return (
    <div className=" space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading title={"Formulaire AMAP"} description={"Creation d'un formulaire AMAP"} />
      </div>
      <Separator />
      <AMAPFormulaire shops={shops} products={products} />
    </div>
  );
}

export default AMAPFormulairePage;
