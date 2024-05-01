"use client";

import Image from "next/image";
import GalleryTab from "./gallery-tab";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(images[0]);

  useEffect(() => {
    setCurrentImage(images[0]);
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
            <GalleryTab key={image} image={image} />
          ))}
        </TabsList>
      </div>
      <div className="aspect-square w-full bg-white sm:rounded-lg">
        {images.map((image) => (
          <TabsContent value={image} key={image}>
            <div className="relative aspect-square h-full w-full overflow-hidden sm:rounded-lg">
              <Image
                fill
                sizes="80vw"
                src={image}
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
