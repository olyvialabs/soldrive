import { Metadata } from "next";
import AppHeader from "~/modules/Landing/components/app-header";
import FooterContent from "~/modules/Landing/components/footer-content";
import SettingsContent from "~/modules/User/components/SettingsContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Settings | Soldrive",
  description: "Settings Page",
};

export default function SettingsPage() {
  return (
    <>
      <AppHeader />
      <SettingsContent />
      <FooterContent />
    </>
  );
}
