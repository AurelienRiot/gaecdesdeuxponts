import { Logout } from "@/components/auth/auth";
import { checkPro } from "@/components/auth/checkAuth";
import Footer from "@/components/footer";
import NavBar from "@/components/navbar-pro/navbar";
import { CategoriesProvider } from "@/context/categories-context";
import prismadb from "@/lib/prismadb";
import { ProColorSchema } from "@/providers/color-schema-provider";
import SessionRole from "./session-role";

export const revalidate = 0;

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

  const categories = await prismadb.category.findMany({
    where: {
      products: {
        some: { isPro: true, isArchived: false },
      },
    },
  });
  return (
    <CategoriesProvider cat={categories}>
      <SessionRole />
      <ProColorSchema />
      <NavBar />
      <main className="pt-16 ">{children}</main>
      <Footer />
    </CategoriesProvider>
  );
}
