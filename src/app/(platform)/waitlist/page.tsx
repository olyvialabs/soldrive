import { Metadata } from "next";
import AppHeader from "~/modules/Landing/components/app-header";
import FooterContent from "~/modules/Landing/components/footer-content";
import { WaitlistContent } from "~/modules/Waitlist/components/WaitlistContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Waitlist Page",
  description: "Waitlist Page",
};

export default function WaitlistPage() {
  return (
    <>
      <WaitlistContent />
      <FooterContent />
    </>
  );
}
