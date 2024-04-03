"use client";

import { Image as ImageType } from "@prisma/client";
import Image from "next/image";
import GalleryTab from "./gallery-tab";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

interface GalleryProps {
  images: ImageType[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(images[0].id);

  useEffect(() => {
    setCurrentImage(images[0].id);
  }, [images]);
  return (
    <Tabs
      onValueChange={setCurrentImage}
      value={currentImage}
      className="flex flex-col-reverse"
    >
      <div className="mx-auto mt-6  block w-full max-w-2xl  lg:max-w-none">
        <TabsList className="grid h-fit grid-cols-4 gap-6 ">
          {images.map((image) => (
            <GalleryTab key={image.id} image={image} />
          ))}
        </TabsList>
      </div>
      <div className="aspect-square w-full bg-white sm:rounded-lg">
        {images.map((image) => (
          <TabsContent value={image.id} key={image.id}>
            <div className="relative aspect-square h-full w-full overflow-hidden sm:rounded-lg">
              <Image
                fill
                sizes="80vw"
                src={image.url}
                alt="image"
                className="object-cover object-center"
              />
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export default Gallery;
