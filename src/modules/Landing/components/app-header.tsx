import LogoContent from "./logo-content";
import { MobileDrawer } from "./mobile-drawer";
import { AuthenticatedOptions } from "./authenticated-options";
import { useRouter } from "next/navigation";

const AppHeader = () => {
  return (
    <>
      <header className="relative z-50 w-full flex-none text-sm font-semibold leading-6">
        <nav
          aria-label="Global"
          className="mx-auto max-w-container px-4 sm:px-6 lg:px-8"
        >
          <div className="relative flex items-center py-[2.125rem]">
            <LogoContent />
            <div className="ml-auto hidden lg:flex lg:items-center"></div>

            <MobileDrawer>
              <button
                type="button"
                className="-my-1 -mr-1 ml-6 flex h-8 w-8 items-center justify-center lg:hidden"
              >
                <span className="sr-only">Open navigation</span>
                <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-white">
                  <path
                    d="M3.75 12h16.5M3.75 6.75h16.5M3.75 17.25h16.5"
                    fill="none"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  ></path>
                </svg>
              </button>
            </MobileDrawer>
            <div className="hidden lg:ml-8 lg:flex lg:items-center lg:border-l lg:border-white lg:pl-8">
              <AuthenticatedOptions />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default AppHeader;
