import Footer from "@/components/footer";
import NavBar from "@/components/navbar-public/navbar";
import { CategoriesProvider } from "@/context/categories-context";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CategoriesProvider isPro={false}>
      <NavBar />
      <main className="pt-16 ">{children}</main>
      <Footer />
    </CategoriesProvider>
  );
}
