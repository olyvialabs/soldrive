import { Metadata } from "next";
import { FileDisplayContent } from "~/modules/Files/FileDisplayer/components/FileDisplayContent";
import { FileTestContent } from "~/modules/Files/FileUpload/components/FileTestContent";
import AppHeader from "~/modules/Landing/components/app-header";
import FooterContent from "~/modules/Landing/components/footer-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "App Page",
  description: "App Page",
};

export default function TestPage() {
  return (
    <>
      <AppHeader />
      <FileDisplayContent />
      <FooterContent />
    </>
  );
  return (
    <>
      <FileTestContent />
      <div className="my-8 gap-4" id="templates-section"></div>
    </>
  );
}
