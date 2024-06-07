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
    <>
      <AppHeader />
      <SoldriveTransferComponent />
      <FooterContent />
    </>
  );
}
