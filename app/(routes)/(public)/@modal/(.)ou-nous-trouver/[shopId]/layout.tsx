import ModalLayoutProvider from "@/providers/modal-layout-provider";

function ShopModalLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModalLayoutProvider className="sm:max-w-[90%] md:max-w-[90%] px-0 " title="Modal magasin">
      {children}
    </ModalLayoutProvider>
  );
}

export default ShopModalLayout;
