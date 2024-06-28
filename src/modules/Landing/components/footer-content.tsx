import { Button } from "~/components/ui/button";
import LogoContent from "./logo-content";
import Link from "next/link";

const FooterContent = () => {
  return (
    <footer className="mx-auto mt-8 w-full max-w-container px-4 sm:px-6 lg:px-8">
      <div className="flex w-full flex-col items-center justify-center border-t border-gray-700 bg-transparent py-10">
        <LogoContent />
        <div className="mt-6 flex w-full">
          <span className="w-full text-center text-sm leading-6">
            © 2024 SolDrive. All rights reserved.
          </span>
        </div>
        <div className="mt-4 flex items-center justify-center text-sm font-semibold leading-6 text-slate-700">
          <Link href="https://olyvia.io/privacy" target="_blank">
            <Button variant="link" className="cursor-pointer text-white">
              Privacy policy
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default FooterContent;
