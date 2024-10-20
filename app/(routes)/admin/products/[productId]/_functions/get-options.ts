"server only";

import { getAllOptions } from "@/components/product/product-function";
import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export const getOptions = unstable_cache(
  async () => {
    const options = await prismadb.option.findMany({
      select: {
        name: true,
        value: true,
      },
    });
    const mappedGroupedOptions = getAllOptions(options);
    mappedGroupedOptions.forEach((option, index) => {
      mappedGroupedOptions[index] = {
        name: option.name,
        values: option.values.some((value) => value === "Personnalisé")
          ? option.values
          : [...option.values, "Personnalisé"],
      };
    });

    return mappedGroupedOptions;
  },
  ["getOptions"],
  { revalidate: 60 * 60 * 24, tags: ["products"] },
);
