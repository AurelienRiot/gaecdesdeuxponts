import Footer from "@/components/footer";
import NavBar from "@/components/navbar-public/navbar";
import { CategoriesProvider } from "@/context/categories-context";
import prismadb from "@/lib/prismadb";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await prismadb.category.findMany({
    where: {
      products: {
        some: { isPro: false, isArchived: false },
      },
    },
  });
  categories.map((category) => {
    console.log(category.name);
  });

  return (
    <CategoriesProvider cat={categories}>
      <NavBar />
      <main className="pt-16 ">{children}</main>
      <Footer />
    </CategoriesProvider>
  );
}
