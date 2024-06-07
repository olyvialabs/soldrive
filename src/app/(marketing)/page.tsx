import { Metadata } from "next";
import { LandingScreen } from "~/modules/Landing/components/LandingScreen";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Landing Page",
  description: "Landing Page",
};

export default function HomePage() {
  return <LandingScreen />;
}
