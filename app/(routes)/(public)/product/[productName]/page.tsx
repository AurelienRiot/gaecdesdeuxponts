import { Metadata } from "next";
import ClientWrapper from "./components/client-wraper";

interface ProductPageProps {
  params: {
    productName: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  return {
    title: `Laiterie du Pont Robert - ${decodeURIComponent(params.productName)}`,
  };
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
  const productName = decodeURIComponent(params.productName);

  return <ClientWrapper productName={productName} />;
};

export default ProductPage;
