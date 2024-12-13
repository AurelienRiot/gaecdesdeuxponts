export default function UserLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
