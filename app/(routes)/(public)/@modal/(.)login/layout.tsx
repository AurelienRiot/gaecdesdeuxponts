import ModalLayoutProvider from "@/providers/modal-layout-provider";

function LoginModalLayout({ children }: { children: React.ReactNode }) {
  return <ModalLayoutProvider title="Modal page de connexion">{children}</ModalLayoutProvider>;
}

export default LoginModalLayout;
