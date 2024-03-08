interface ImageLoaderBillboardProps {
  children: React.ReactNode
  src: string
}

const ImageLoaderBillboard: React.FC<ImageLoaderBillboardProps> = ({ 
  src,
  children
 }) => {

  
  return (
    <div className="rounded-xl relative aspect-square md:aspect-[3/1] overflow-hidden bg-cover" style={{ backgroundImage: `url(${src})`} }>
      {children}
      </div>
  );
}

export default ImageLoaderBillboard;