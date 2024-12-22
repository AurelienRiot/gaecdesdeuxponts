import ModalLayoutProvider from "@/providers/modal-layout-provider";

function ShopModalLayout({ children }: { children: React.ReactNode }) {
  return <ModalLayoutProvider title="Modal magasin">{children}</ModalLayoutProvider>;
}

export default ShopModalLayout;
