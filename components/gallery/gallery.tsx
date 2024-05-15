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
      className="relative mx-auto flex w-full max-w-[60vw]  flex-col-reverse justify-self-center lg:max-w-xl"
    >
      <div className="mx-auto mt-6  block w-full  lg:max-w-none">
        <TabsList className="grid h-fit grid-cols-4 gap-6 ">
          {images.map((image) => (
            <GalleryTab
              key={image}
              selected={image === currentImage}
              image={image}
            />
          ))}
        </TabsList>
      </div>
      <div className="relative aspect-square w-full  rounded-lg bg-white">
        {images.map((image) => (
          <TabsContent value={image} key={image}>
            <div className="relative aspect-square h-full w-full overflow-clip sm:rounded-lg">
              <Image
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 50vw"
                src={image}
                alt="image"
                className="object-contain object-center"
              />
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export default Gallery;
