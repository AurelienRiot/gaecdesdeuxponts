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
      <div className="pt-16 ">{children}</div>
      <Footer />
    </>
  );
}
