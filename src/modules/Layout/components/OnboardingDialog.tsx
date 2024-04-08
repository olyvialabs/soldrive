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
import { useEffect, useState } from "react";

const OnboardingDialogContent = () => {
  const wallet = useWallet();
  const [forceShowSolana, setForceShowSolana] = useState();
  useEffect(() => {
    if (!window) {
      return;
    }
    setInterval(() => {
      const provider = window.solana;
      const walletPublicKey = provider?.publicKey?.toString();
      if (forceShowSolana !== walletPublicKey) {
        setForceShowSolana(walletPublicKey);
      }
    }, 1000);
    // logic must be only while not being received, not always
  }, [window]);

  console.log(wallet.publicKey);
  console.log(wallet.publicKey);
  console.log(wallet.publicKey);
  const provider = window.solana;
  console.log(provider);
  console.log(provider);
  console.log(provider);
  if (forceShowSolana || wallet.connected) {
    return (
      <div>
        <DialogHeader>
          <DialogTitle>Creation of your DID</DialogTitle>
          <DialogDescription>
            To continue, please pick up a username.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <SolanaLogFetcher />
        </div>
      </div>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Authenticate with your Wallet</DialogTitle>
        <DialogDescription>
          To continue, please authenticate first.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <WalletConnectionButton type="connect" />
      </div>
    </>
  );
};

export function OnboardingDialog() {
  return (
    <AllSolanaContent>
      <Dialog open={true}>
        <DialogContent className="sm:max-w-[425px] ">
          <div className="flex flex-col items-center justify-center">
            <OnboardingDialogContent />
          </div>
        </DialogContent>
      </Dialog>
    </AllSolanaContent>
  );
}
