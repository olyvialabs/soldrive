import { Metadata } from "next";
import HeroContent from "~/modules/Landing/components/hero-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Landing Page",
  description: "Landing Page",
};

export default function HomePage() {
  return (
    <>
      <HeroContent />
      <div className="my-8 gap-4" id="templates-section"></div>
    </>
  );
}
