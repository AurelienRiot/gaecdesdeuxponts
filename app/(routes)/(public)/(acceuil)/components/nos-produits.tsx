import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import Image from "next/image";
import prismadb from "@/lib/prismadb";

const NosProduits = async () => {
  const categories = await prismadb.category.findMany({
    where: {
      products: {
        some: { isPro: false, isArchived: false },
      },
    },
  });
  if (!categories) {
    return null;
  }
  const content = categories.map((category) => {
    return {
      title: category.name,
      description: category.description || "",
      content: (
        <div className="flex h-full  w-full items-center justify-center text-white">
          <Image
            src={category.imageUrl}
            width={300}
            height={300}
            className="h-full w-full object-cover"
            alt={category.name}
          />
        </div>
      ),
    };
  });
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-transparent py-6 font-bold text-primary">
      <h2 className="text-xl sm:text-3xl md:text-5xl">
        Découvrez nos produits
      </h2>

      <StickyScroll content={content} />
    </div>
  );
};

export default NosProduits;
