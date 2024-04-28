import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideProps } from "lucide-react";
import Image from "next/image";
import { NavigationMenuDemo } from "./_components/nav-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartButton } from "@/components/navbar-public/navbar-actions";
import AuthLink from "./_components/auth-link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { PartenaireCards } from "./_components/partenaires";

export default function Component() {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0   z-30 flex h-16 w-full items-center justify-between bg-background px-2 py-4 shadow-md xs:px-4  sm:px-6 ">
        <HamburgerMenuIcon className="h-6 w-6 lg:hidden" />
        <Link href="/">
          <Image
            alt="Logo"
            className="h-16 w-auto "
            src="/logo-rect.webp"
            width={155.86}
            height={56}
          />
        </Link>

        <NavigationMenuDemo />
        <div className={"flex items-center sm:gap-x-4 sm:pr-2"}>
          <AuthLink />
          <ThemeToggle />
          <CartButton />
        </div>
      </header>
      <main className="px-6 py-12">
        <section
          className="grid max-h-[80vh] grid-cols-1 gap-12
         md:grid-cols-2 lg:grid-cols-[2fr_3fr]"
        >
          <div className="flex flex-col justify-center text-center">
            <h2 className="mb-4 text-2xl font-bold lg:text-4xl">
              Lait cru frais directement de le ferme
            </h2>
            <p className="mb-8 lg:text-lg">
              Découvrez le goût pur et crémeux de notre lait cru frais de la
              ferme. Rempli de nutriments essentiels, notre lait provient
              directement de nos vaches heureuses et en bonne santé.
            </p>
            <div className="mx-auto flex gap-4">
              <Button>Acheter</Button>
              <Button variant={"outline"}>En savoir plus</Button>
            </div>
          </div>
          <div>
            <Image
              alt="Farm Hero Image"
              className="h-auto w-full rounded-md object-cover"
              height={2630}
              src="/vache-champs.webp"
              width={4676}
            />
          </div>
        </section>
        <section className="mt-16">
          <h2 className="mb-8 text-3xl font-bold">Our Products</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            <Card>
              <Image
                alt="Raw Milk"
                className="rounded-t-md object-cover"
                height={200}
                src="/skeleton-image.webp"
                style={{
                  aspectRatio: "300/200",
                  objectFit: "cover",
                }}
                width={300}
              />
              <div className="p-4">
                <h3 className="mb-2 text-xl font-bold">Raw Milk</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Our farm-fresh raw milk is packed with essential nutrients and
                  vitamins.
                </p>
                <Button className="rounded-md bg-[#4CAF50] px-4 py-2 text-[#fff] transition-colors hover:bg-[#3e8e41]">
                  Buy Now
                </Button>
              </div>
            </Card>
            <Card>
              <Image
                alt="Artisanal Cheese"
                className="rounded-t-md object-cover"
                height={200}
                src="/skeleton-image.webp"
                style={{
                  aspectRatio: "300/200",
                  objectFit: "cover",
                }}
                width={300}
              />
              <div className="p-4">
                <h3 className="mb-2 text-xl font-bold">Artisanal Cheese</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Indulge in our delicious, handcrafted artisanal cheese made
                  from our raw milk.
                </p>
                <Button className="rounded-md bg-[#4CAF50] px-4 py-2 text-[#fff] transition-colors hover:bg-[#3e8e41]">
                  Buy Now
                </Button>
              </div>
            </Card>
            <Card>
              <Image
                alt="Creamy Butter"
                className="rounded-t-md object-cover"
                height={200}
                src="/skeleton-image.webp"
                style={{
                  aspectRatio: "300/200",
                  objectFit: "cover",
                }}
                width={300}
              />
              <div className="p-4">
                <h3 className="mb-2 text-xl font-bold">Creamy Butter</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Indulge in the rich, velvety texture of our homemade butter.
                </p>
                <Button className="rounded-md bg-[#4CAF50] px-4 py-2 text-[#fff] transition-colors hover:bg-[#3e8e41]">
                  Buy Now
                </Button>
              </div>
            </Card>
          </div>
        </section>
        <section className="mt-16">
          <h2 className="mb-8 text-3xl font-bold">Why Choose Meadow Farms?</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex items-start gap-4">
              <MilkIcon className="h-8 w-8 text-[#4CAF50]" />
              <div>
                <h3 className="mb-2 text-xl font-bold">Ethical Farming</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We prioritize the well-being of our cows and maintain the
                  highest standards of animal welfare.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <LeafIcon className="h-8 w-8 text-[#4CAF50]" />
              <div>
                <h3 className="mb-2 text-xl font-bold">
                  Sustainable Practices
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our farming methods are eco-friendly and minimize our
                  environmental impact.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <DropletIcon className="h-8 w-8 text-[#4CAF50]" />
              <div>
                <h3 className="mb-2 text-xl font-bold">
                  Pure, Nutritious Milk
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our raw milk is packed with essential vitamins, minerals, and
                  beneficial bacteria.
                </p>
              </div>
            </div>
          </div>
        </section>
        <PartenaireCards />
      </main>

      <footer className="bg-[#262626] px-6 py-8 text-[#f5f5f5]">
        <div className="container mx-auto flex items-center justify-between">
          <p>© 2023 Meadow Farms. All rights reserved.</p>
          <nav className="flex items-center gap-6">
            <Link className="transition-colors hover:text-[#4CAF50]" href="#">
              Privacy Policy
            </Link>
            <Link className="transition-colors hover:text-[#4CAF50]" href="#">
              Terms of Service
            </Link>
            <Link className="transition-colors hover:text-[#4CAF50]" href="#">
              Contact Us
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function DropletIcon(props: LucideProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}

function LeafIcon(props: LucideProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function MilkIcon(props: LucideProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2h8" />
      <path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2" />
      <path d="M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0" />
    </svg>
  );
}
