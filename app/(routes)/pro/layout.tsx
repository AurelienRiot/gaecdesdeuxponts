import { Logout } from "@/components/auth/auth";
import { checkPro } from "@/components/auth/checkAuth";
import Footer from "@/components/footer";
import NavBar from "@/components/navbar-pro/navbar";
import prismadb from "@/lib/prismadb";
import { CategoriesProvider } from "@/providers/categories-provider";
import { Suspense } from "react";
import { ProColorSchema } from "@/providers/color-schema-provider";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await checkPro();

  if (!isAuth) {
    return (
      <Logout
        callbackUrl={`/login?callbackUrl=${encodeURIComponent("/pro")}`}
      />
    );
  }
  return (
    <>
      <Suspense fallback={null}>
        <ServerCategories />
      </Suspense>
      <ProColorSchema />
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
        some: { isPro: true, isArchived: false },
      },
    },
  });

  return <CategoriesProvider categories={categories} />;
}
