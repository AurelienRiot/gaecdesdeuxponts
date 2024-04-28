import Footer from "@/components/footer";
import NavBar from "@/components/navbar-public/navbar";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main id="main-content" className="pt-16 print:pt-0">
        {children}
      </main>
      <Footer />
    </>
  );
}
