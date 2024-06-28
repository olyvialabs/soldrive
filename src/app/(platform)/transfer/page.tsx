import { Metadata } from "next";
import SoldriveTransferComponent from "~/modules/Files/Transfer/components/SoldriveTransferComponent";
import AppHeader from "~/modules/Landing/components/app-header";
import FooterContent from "~/modules/Landing/components/footer-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Transfer | Soldrive",
  description: "App Transfer Page",
};

export default function AppTransferPage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        className="absolute inset-0 -z-10 bg-left-top bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/images/DegradadoSeccion1Izquierdo.png')",
        }}
      ></div>
      <AppHeader />
      <SoldriveTransferComponent />
      <div className="z-0 w-full">
        <FooterContent />
      </div>
    </div>
  );
}
