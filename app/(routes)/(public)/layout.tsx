import Footer from "@/components/footer";
import NavBar from "@/components/navbar-public/navbar";
import prismadb from "@/lib/prismadb";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = prismadb.category.findMany({
    where: {
      products: {
        some: { isPro: false, isArchived: false },
      },
    },
  });

  return (
    <>
      <NavBar categories={categories} />
      <main className="pt-16 ">{children}</main>
      <Footer />
    </>
  );
}
