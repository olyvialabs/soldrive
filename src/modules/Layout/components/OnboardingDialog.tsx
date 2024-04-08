import { useWallet } from "@solana/wallet-adapter-react";
import { WalletConnectButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  AllSolanaContent,
  WalletConnectionButton,
} from "~/modules/Auth/components/WalletConnectionButton";
import SolanaLogFetcher from "./AppLayoutAuthenticationButton";
import { useAuthStore } from "~/modules/Auth/store/store";

const OnboardingDialogContent = () => {
  const wallet = useWallet();
  if (wallet.connected) {
    return <SolanaLogFetcher />;
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Authenticate with your Wallet</DialogTitle>
        <DialogDescription>
          To see your files, please authenticate first.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <WalletConnectionButton type="connect" />
      </div>
    </>
  );
};

export function OnboardingDialog() {
  const { shouldShowAuthModal } = useAuthStore();
  return (
    <AllSolanaContent>
      <Dialog open={true}>
        <DialogContent className="min-h-[480px] sm:max-w-[425px]">
          <OnboardingDialogContent />
        </DialogContent>
      </Dialog>
    </AllSolanaContent>
  );
}
