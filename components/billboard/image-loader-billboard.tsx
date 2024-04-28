interface ImageLoaderBillboardProps {
  children: React.ReactNode;
  src: string;
}

const ImageLoaderBillboard: React.FC<ImageLoaderBillboardProps> = ({
  src,
  children,
}) => {
  return (
    <div
      className="relative mx-auto aspect-square max-h-[50vh] overflow-hidden rounded-xl bg-cover "
      style={{ backgroundImage: `url(${src})` }}
    >
      {children}
    </div>
  );
};

export default ImageLoaderBillboard;
