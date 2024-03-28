import { Metadata } from "next";
import { FileTestContent } from "~/modules/FileUpload/components/FileTestContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Test Page",
  description: "Test Page",
};

export default function TestPage() {
  return (
    <>
      <FileTestContent />
      <div className="my-8 gap-4" id="templates-section"></div>
    </>
  );
}
