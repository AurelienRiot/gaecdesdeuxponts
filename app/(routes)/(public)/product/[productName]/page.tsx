import { Metadata } from "next";
import ClientWrapper from "./_components/client-wraper";

interface ProductPageProps {
  params: {
    productName: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  return {
    title: `${decodeURIComponent(params.productName)} - Laiterie du Pont Robert`,
  };
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
  const productName = decodeURIComponent(params.productName);

  return <ClientWrapper productName={productName} />;
};

export default ProductPage;
