import { Metadata } from "next";
import { MyWalletFiles } from "~/modules/Files/FileDisplayer/components/MyWalletFiles";
import AppHeader from "~/modules/Landing/components/app-header";
import FooterContent from "~/modules/Landing/components/footer-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Shared | Soldrive",
  description: "App Shared Page",
};

export default function AppSharedPage() {
  return (
    <>
      <AppHeader />
      <MyWalletFiles forView="shared" />
      <FooterContent />
    </>
  );
}
