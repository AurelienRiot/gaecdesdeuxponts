import type { MainProduct } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { makeProductUrl } from "./product-function";
import { IconButton } from "../ui/button";
import { FaInfo } from "../react-icons";

interface ProductCartProps {
  data: MainProduct;
}

const MainProductCart: React.FC<ProductCartProps> = ({ data }) => {
  const url = makeProductUrl({
    productName: data.name,
    categoryName: data.categoryName,
    isPro: data.isPro,
  });

  return (
    <div className="group flex w-40 cursor-pointer flex-col justify-between gap-4 rounded-xl border bg-secondary p-3 transition-transform hover:scale-105 md:w-52 ">
      <Link
        href={url}
        className="relative aspect-square rounded-xl bg-white before:absolute before:inset-0 before:z-10 before:rounded-xl before:bg-black/20 before:opacity-0 before:duration-300 before:ease-linear before:animate-in group-hover:before:opacity-100 "
      >
        <Image
          src={data.imagesUrl[0]}
          fill
          sizes="80vw"
          alt="Image"
          className="aspect-square rounded-xl object-cover "
        />
        <div className="absolute bottom-5 w-full px-6  ">
          <div className="flex justify-center gap-x-6">
            <IconButton
              className="z-20 size-10 sm:opacity-0 sm:group-hover:opacity-100"
              title="Aperçue"
              Icon={FaInfo}
            />
          </div>
        </div>
      </Link>
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Link href={url} className=" text-xl font-semibold  text-primary hover:underline hover:underline-offset-2">
            {data.name}
          </Link>
        </div>
        {/* <div className="flex flex-col gap-4">
          {data.options.map((option) => (
            <Badge key={option.name} variant={"green"} className="w-fit">
              {option.name} : {option.value}
            </Badge>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default MainProductCart;
