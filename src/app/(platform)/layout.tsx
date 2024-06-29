"use client";

import { AllSolanaContent } from "~/modules/Auth/components/WalletConnectionButton";

require("@solana/wallet-adapter-react-ui/styles.css");

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AllSolanaContent>
      <div className="w-full bg-purple-600 text-center md:fixed">
        <span className="w-full text-center text-sm">
          This is a beta version of our platform. Please avoid uploading any
          confidential or private information at this time.
        </span>
      </div>
      {children}
    </AllSolanaContent>
  );
}
