import CookiesBanner from "@/components/cookies-banner";
import Footer from "@/components/footer";
import PublicHeader from "@/components/navbar-public/header";

export default async function PublicLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="pt-20 ">
        {children}
        <div className="absolute inset-0 -z-10"> {modal}</div>
      </main>
      <CookiesBanner />
      <Footer />
    </>
  );
}
