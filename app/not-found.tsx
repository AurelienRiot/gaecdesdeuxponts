import Footer from "@/components/footer";
import PublicHeader from "@/components/navbar-public/header";
import NotFoundPage from "@/components/not-found";

const NotFound = () => {
  return (
    <>
      <PublicHeader />
      <main className="pt-16">
        <NotFoundPage />
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
