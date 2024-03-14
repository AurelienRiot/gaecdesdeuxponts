import Footer from "@/components/footer";
import NavBar from "@/components/navbar-public/navbar";
import prismadb from "@/lib/prismadb";
import { addDelay } from "@/lib/utils";
import { CategoriesProvider } from "@/providers/categories-provider";
import { Suspense } from "react";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <ServerCategories />
      </Suspense>
      <NavBar />
      <main className="pt-16 ">{children}</main>
      <Footer />
    </>
  );
}

async function ServerCategories() {
  const categories = await prismadb.category.findMany({
    where: {
      products: {
        some: {},
      },
    },
  });
  console.log("categories");
  await addDelay(5000);

  return <CategoriesProvider categories={categories} />;
}
