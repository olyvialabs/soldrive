import { useEffect, useMemo, useState } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import dynamic from "next/dynamic";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useInitializeFilesStores } from "~/modules/Files/FileDisplayer/hooks/useInitializeFilesStores";

const StoreCleanerWrapper = ({ children }: { children: React.ReactNode }) => {
  const [prevWallet, setPrevWallet] = useState<string | undefined>("");
  const { publicKey } = useWallet();
  const { clearAllStores } = useInitializeFilesStores();
  useEffect(() => {
    const publicKeyStr = publicKey?.toString();
    if (prevWallet !== publicKeyStr) {
      setPrevWallet(publicKeyStr);
    }
    clearAllStores();
    // (publicKey?.toString());
  }, [publicKey]);

  return children;
};

const WalletDisconnectButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletDisconnectButton,
  { ssr: false },
);
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
);

const AllSolanaContent = ({ children }: { children: React.ReactNode }) => {
  const network = WalletAdapterNetwork.Devnet;
  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider className="z-[999999]">
          <StoreCleanerWrapper>{children}</StoreCleanerWrapper>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const WalletConnectionButton = ({
  type,
}: {
  type: "both" | "connect" | "disconnect";
}) => {
  // <AllSolanaContent>

  return (
    <>
      {["both", "connect"].includes(type) && (
        <WalletMultiButtonDynamic
          onClick={() => {}}
          className={cn("text-white", buttonVariants({ variant: "default" }))}
        />
      )}
      {["both", "disconnect"].includes(type) && (
        <WalletDisconnectButtonDynamic
          className={cn(buttonVariants({ variant: "outline" }))}
        />
      )}
    </>
  );
};

export { AllSolanaContent, WalletConnectionButton };
