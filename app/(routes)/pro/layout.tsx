import { Logout } from "@/components/auth/auth";
import { checkPro } from "@/components/auth/checkAuth";
import Footer from "@/components/footer";
import NavBar from "@/components/navbar-pro/navbar";
import prismadb from "@/lib/prismadb";
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

  const categories = prismadb.category.findMany({
    where: {
      products: {
        some: { isPro: false, isArchived: false },
      },
    },
  });
  return (
    <>
      <ProColorSchema />
      <NavBar categories={categories} />
      <main className="pt-16 ">{children}</main>
      <Footer />
    </>
  );
}
