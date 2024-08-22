import getShops from "@/actions/get-shops";
import { ShopCard } from "@/components/skeleton-ui/shop-card";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import PlacePicker from "./_components/place";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Points de vente et magasins partenaires",
    description:
      "Trouvez les points de vente et magasins partenaire qui vendent et utilisent notre lait les plus proches de chez vous",
  };
}

const OuNousTrouver = async () => {
  return (
    <Container className="my-8 space-y-8 p-2">
      <div className="text-center xl:text-left">
        <h1 className="text-4xl font-bold">Points de vente et magasins partenaires</h1>
        <p className="text-lg">
          Trouvez les points de vente et magasins partenaire qui vendent et utilisent notre lait les plus proches de
          chez vous
        </p>
      </div>
      <Suspense fallback={<PlaceLoading />}>
        <ServerPlace />
      </Suspense>
    </Container>
  );
};

export default OuNousTrouver;

const ServerPlace = async () => {
  const { shops, farmShop } = await getShops();

  return <PlacePicker shops={shops} farmShop={farmShop} />;
};

const PlaceLoading = () => (
  <>
    <Image
      alt="chargement"
      className="h-[70vh] w-full rounded-md object-cover"
      src="/skeleton-image.webp"
      width={1600}
      height={1067}
    />
    <div className="flex flex-wrap items-center justify-start gap-2">
      <Button disabled variant="outline" role="combobox" className={"justify-between active:scale-100"}>
        Rechercher votre adresse
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      <Input disabled className="w-fit" placeholder="Rechercher le nom" />
    </div>

    <div className="grid grid-cols-1 items-center justify-items-center gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {Array(10)
        .fill(null)
        .map((_, i) => (
          <ShopCard display="find" key={String(i)} />
        ))}
    </div>
  </>
);
