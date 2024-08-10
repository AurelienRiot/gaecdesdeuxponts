import { LogoutButton } from "@/components/auth/auth-button";
import { MainNav } from "@/components/navbar-admin/main-nav";
import { ThemeToggle } from "../theme-toggle";
import MobileNav from "./mobile-nav2";
import UserRole from "./user-role";

const Navbar = async () => {
  return (
    <header className="border-t sm:border-t-0 sm:border-b bg-foreground sm:bg-background fixed bottom-0 left-0 right-0 sm:relative w-full z-[1100]">
      <div className="md:flex hidden h-16 items-center px-4  justify-between ">
        <MainNav className="pl-8 " />
        {/* <MobileNav className=" md:hidden" /> */}
        <div className=" flex items-center space-x-4 ">
          <UserRole />
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
      <MobileNav />
    </header>
  );
};

export default Navbar;
