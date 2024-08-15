import { useWallet } from "@solana/wallet-adapter-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  AllSolanaContent,
  WalletConnectionButton,
} from "~/modules/Auth/components/WalletConnectionButton";
import { ReactNode, useEffect, useState } from "react";
import useContractIndexer from "~/modules/Files/hooks/useContractIndexer";
import { Skeleton } from "~/components/ui/skeleton";
import { UserInformationData, useAuthStore } from "~/modules/Store/Auth/store";
import CreateUserButton from "./CreateNewUser";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useInitializeFilesStores } from "~/modules/Files/FileDisplayer/hooks/useInitializeFilesStores";
import Link from "next/link";
import { BorderBeam } from "~/components/ui/border-beam";
type ForView = "landing" | "dialog" | undefined;
type DialogItemProps = {
  forView?: "landing" | "dialog";
  children: ReactNode;
};

const DialogHeaderContent = ({ forView, children }: DialogItemProps) => {
  if (forView === "landing") {
    return <div className="flex flex-col">{children}</div>;
  }
  return <DialogHeader>{children}</DialogHeader>;
};

const DialogTitleContent = ({ forView, children }: DialogItemProps) => {
  if (forView === "landing") {
    return <span className="text-xl font-bold">{children}</span>;
  }
  return <DialogTitle>{children}</DialogTitle>;
};

const DialogDescriptionContent = ({ forView, children }: DialogItemProps) => {
  if (forView === "landing") {
    return <span className="">{children}</span>;
  }
  return <DialogDescription>{children}</DialogDescription>;
};

export const OnboardingDialogContent = ({ forView }: { forView?: ForView }) => {
  const wallet = useWallet();
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorRetrievalMsg, setErrorRetrievalMsg] = useState("");
  const [retryingLoading, setRetryingLoading] = useState(false);
  const [shouldShowCreateDid, setShouldShowCreateDid] = useState(false);
  const { getUserByWallet, getUserSubscriptionByWallet } = useContractIndexer();
  const {
    changeAuthModalVisibility,
    setUserInformationData,
    setSubscriptionTimestamp,
  } = useAuthStore();
  const { clearAllStores } = useInitializeFilesStores();
  const findUserWithWalletRegistered = async () => {
    if (!wallet?.publicKey) {
      toast(
        "It seems there is an issue getting the wallet address of your account.",
      );
      return;
    }

    if (!retryingLoading) {
      setRetryingLoading(true);
    }
    clearAllStores();
    const response = await getUserByWallet({
      walletAddress: wallet.publicKey.toString(),
    });

    const subscriptionResult = await getUserSubscriptionByWallet({
      walletAddress: wallet.publicKey.toString(),
    });

    setRetryingLoading(false);
    if (!response.success) {
      setErrorRetrievalMsg(response.error || "Error retrieving user data");
      return;
    }

    if (subscriptionResult.success) {
      setSubscriptionTimestamp(
        subscriptionResult?.data?.timestamp
          ? parseInt(subscriptionResult?.data?.timestamp)
          : 0,
      );
    }

    if (!response.data?.user_solana) {
      setShouldShowCreateDid(true);
      setInitialLoading(false);
      return;
    }

    setUserInformationData(response.data as UserInformationData);

    setInitialLoading(false);
    changeAuthModalVisibility(false);
  };

  useEffect(() => {
    if (wallet?.publicKey) {
      findUserWithWalletRegistered();
    }
  }, [wallet?.publicKey]);

  const HeaderLogo =
    forView === "landing" ? null : (
      <Link href="/">
        <div className="mb-2 flex flex-row items-center">
          <img
            src="/assets/images/LogoSolo.png"
            alt="SolDrive Logo"
            className="mr-2 w-12"
          />
          <span className="font-bold">SOLDRIVE</span>
        </div>
      </Link>
    );
  if (!wallet?.connected || !wallet?.publicKey?.toString()) {
    return (
      <>
        <DialogHeaderContent forView={forView}>
          {HeaderLogo}
          <DialogTitleContent forView={forView}>
            Authenticate with your Wallet
          </DialogTitleContent>
          <DialogDescriptionContent forView={forView}>
            To continue, please authenticate first.
          </DialogDescriptionContent>
        </DialogHeaderContent>
        <div className="grid gap-4 py-4">
          <WalletConnectionButton type="connect" />
        </div>
      </>
    );
  }

  if (errorRetrievalMsg) {
    return (
      <div>
        <DialogHeaderContent forView={forView}>
          {HeaderLogo}
          <DialogTitleContent forView={forView}>
            Create Your Decentralized Identifier (DID)
          </DialogTitleContent>
          <DialogDescriptionContent forView={forView}>
            Please choose a username to proceed.
          </DialogDescriptionContent>
        </DialogHeaderContent>
        <div className="mt-2 flex w-full flex-col">
          <p>
            An error occurred while retrieving your information from your
            wallet.
          </p>
          <p className="text-red-500">{errorRetrievalMsg}</p>
          <div className="flex justify-center">
            <Button
              className="text-primary-500 mt-2"
              onClick={findUserWithWalletRegistered}
              loading={retryingLoading}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div>
        <DialogHeaderContent forView={forView}>
          {HeaderLogo}
          <DialogTitleContent forView={forView}>
            Wallet Authentication Required
          </DialogTitleContent>
          <DialogDescriptionContent forView={forView}>
            Please authenticate with your wallet to proceed.
          </DialogDescriptionContent>
        </DialogHeaderContent>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        </div>
      </div>
    );
  }

  if (shouldShowCreateDid) {
    return (
      <div>
        <DialogHeaderContent forView={forView}>
          {HeaderLogo}
          <DialogTitleContent forView={forView}>
            Create Your Decentralized Identifier (DID)
          </DialogTitleContent>
          <DialogDescriptionContent forView={forView}>
            Please choose a username to proceed.
          </DialogDescriptionContent>
        </DialogHeaderContent>
        <div className="grid gap-4 py-4">
          <CreateUserButton />
          <p className="text-primary-500 text-sm">
            Generating DID for wallet:{" "}
            <b className="break-all text-purple-600">
              {wallet.publicKey.toString()}
            </b>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DialogHeaderContent forView={forView}>
        <DialogTitleContent forView={forView}>
          Authenticate with your Wallet
        </DialogTitleContent>
        <DialogDescriptionContent forView={forView}>
          To continue, please authenticate first.
        </DialogDescriptionContent>
      </DialogHeaderContent>
      <div className="mt-2 flex">
        <span>
          It seems like you don't have a wallet provider installed on your
          browser, please install one like Phantom and try again later.
        </span>
      </div>
    </div>
  );
};

export function OnboardingDialog() {
  // <AllSolanaContent>
  return (
    <Dialog open>
      <DialogContent
        hideCrossButton
        style={{ zIndex: 80 }}
        className="sm:max-w-[425px]"
      >
        <BorderBeam />
        <div
          style={{ zIndex: 90 }}
          className="flex flex-col items-center justify-center"
        >
          <OnboardingDialogContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
