import MobileNav from "./mobile-nav";

const Navbar = async () => {
  return (
    <>
      {/* <header className="border-t sm:border-t-0 sm:border-b bg-foreground sm:bg-background fixed bottom-0 left-0 right-0 sm:relative w-full ">
        <div className="lg:flex hidden h-16 items-center px-4  justify-between ">
          <MainNav className="pl-8 " />
          <div className=" flex items-center space-x-4 ">
            <UserRole />
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header> */}
      <MobileNav
      // className="lg:hidden"
      />
    </>
  );
};

export default Navbar;
