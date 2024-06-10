import { Metadata } from "next";
import SharedFile from "~/modules/Files/FilesShared/SharedFile";
import AppHeader from "~/modules/Landing/components/app-header";
import FooterContent from "~/modules/Landing/components/footer-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "File | Soldrive",
  description: "App Transfer Page",
};

export default function AppFilePage({
  params: { cid },
}: {
  params: { cid: string };
}) {
  return (
    <>
      <AppHeader />
      <SharedFile cid={cid} />
      <FooterContent />
    </>
  );
}
