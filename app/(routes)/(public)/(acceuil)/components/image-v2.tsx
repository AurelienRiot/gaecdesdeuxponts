import Image from "next/image";

const ImageV2 = () => {
  return (
    <div className="relative h-dvh w-full">
      <div className="absolute inset-0 h-1/2 w-full overflow-hidden">
        <Image
          src="/champ.webp"
          alt="image"
          fill
          className="h-full w-full object-cover grayscale"
        />
      </div>
    </div>
  );
};

export default ImageV2;
