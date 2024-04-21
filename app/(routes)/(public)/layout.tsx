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
      <main id="main-content" className="pt-16 print:pt-0">
        {children}
      </main>
      <Footer />
    </CategoriesProvider>
  );
}
