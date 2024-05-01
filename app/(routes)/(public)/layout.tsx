import Footer from "@/components/footer";
import PublicHeader from "@/components/navbar-public-v2/header";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="p-4 pt-16 print:pt-0 ">
        {children}
      </main>
      <Footer />
    </>
  );
}
