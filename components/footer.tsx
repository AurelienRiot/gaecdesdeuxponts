import { cn } from "@/lib/utils";
import Link from "next/link";
import BugReport from "./bug-report/bug-report";

const Footer = ({ className }: { className?: string }) => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <footer className={cn("space-y-2 border-t bg-neutral-800 pb-20 text-neutral-50 sm:pb-6 print:hidden", className)}>
        <div className="mx-auto pb-2 pt-10">
          <p className="text-center text-xs">&copy; {currentYear} Laiterie du Pont Robert. Tous droits réservés.</p>
        </div>
        <nav className="space-y-2">
          <ul className="flex flex-col justify-center gap-6 text-center sm:flex-row">
            <li>
              <Link
                prefetch={false}
                href="/mention-legal"
                className="text-sm font-medium transition-colors hover:text-green-500 hover:underline"
              >
                Mention légales
              </Link>
            </li>
            <li>
              <Link
                prefetch={false}
                href="/pdf/Politique-de-confidentialite.pdf"
                className="text-sm font-medium transition-colors hover:text-green-500 hover:underline"
                target="_blank"
              >
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <Link
                prefetch={false}
                href="/conditions-generales-de-vente"
                className="text-sm font-medium transition-colors hover:text-green-500 hover:underline"
              >
                Conditions générales de vente
              </Link>
            </li>
            <li>
              <Link
                prefetch={false}
                href="/contact#contact"
                scroll={true}
                className="text-sm font-medium transition-colors hover:text-green-500 hover:underline"
              >
                Contact{" "}
              </Link>
            </li>
          </ul>
          <div className="flex items-center justify-center">
            <BugReport className="text-neutral-50 transition-colors hover:text-green-500 hover:underline" />
          </div>
        </nav>
      </footer>
    </>
  );
};

export default Footer;
