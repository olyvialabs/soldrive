"use client";

import { AppLeftSidenav } from "~/modules/Layout/components/AppLeftSidenav";
import sidenavItems from "~/modules/Layout/data/sidenav";
import { OnboardingDialog } from "~/modules/Layout/components/OnboardingDialog";
import { PreviewFileDetails } from "../../FileDetails/components/PreviewFileDetails";
import { useAuthStore } from "~/modules/Store/Auth/store";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { AddNewFileButton } from "./AddNewFileButton";
import { AllSolanaContent } from "~/modules/Auth/components/WalletConnectionButton";
import { useUserFilesStore } from "~/modules/Store/UserFiles/store";
import { MyWalletFilesInnerContent } from "./MyWalletFilesInnerContent";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import SharedFilesWithMe from "../../FilesShared/SharedFilesWithMe";
import useGetAllFilesByWalletIndexer from "../hooks/useGetAllFilesByWalletIndexer";
import { useInitializeFilesStores } from "../hooks/useInitializeFilesStores";

export const FileListLoadingComponent = () => {
  return (
    <div className="flex h-full w-full flex-col items-center space-x-4 rounded rounded-sm border p-2 md:p-4">
      <Skeleton className="h-4 w-[200px]" />
      <div className="w-full py-4">
        <Skeleton className="h-[120px] w-full" />
      </div>
      <Skeleton className="h-4 w-[200px]" />
    </div>
  );
};

const MyWalletFilesLayoutWrapper = () => {
  const { errorRetrieving, isRetrievingFiles } = useUserFilesStore();
  const { getFilesByWallet } = useGetAllFilesByWalletIndexer();
  const wallet = useWallet();

  if (errorRetrieving) {
    return (
      <div className="w-full">
        <p className="text-center">
          There was an error retrieving data from server
        </p>
        <div className="flex justify-center">
          <Button
            className="text-primary-500 mt-2"
            onClick={() => {
              getFilesByWallet(wallet?.publicKey?.toString()!);
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isRetrievingFiles) {
    return (
      <div className="mt-4 grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <FileListLoadingComponent />
        <FileListLoadingComponent />
        <FileListLoadingComponent />
        <FileListLoadingComponent />
        <FileListLoadingComponent />
      </div>
    );
  }

  return (
    <>
      <MyWalletFilesInnerContent />
      <PreviewFileDetails />
    </>
  );
};

const MyWalletFiles = ({ forView }: { forView: "shared" | "own" }) => {
  const { shouldShowAuthModal, userInformation } = useAuthStore();
  const wallet = useWallet();
  const { getFilesByWallet } = useGetAllFilesByWalletIndexer();
  const { clearFileRelatedStores } = useInitializeFilesStores();
  // useEffect(() => {
  //   const walletAddress = wallet?.publicKey?.toString();
  //   if (
  //     walletAddress &&
  //     userInformation?.user_solana &&
  //     walletAddress !== userInformation?.user_solana
  //   ) {
  //     clearFileRelatedStores();
  //   }
  // }, [wallet, userInformation?.user_solana, clearFileRelatedStores]);

  useEffect(() => {
    // let's use userInformation, as when they aren't logged in it shouldn't
    // retrieve anything,
    // but when they log in, re-fire this
    const walletAddress = userInformation?.did_public_address;
    if (walletAddress) {
      clearFileRelatedStores();
      getFilesByWallet(
        forView === "shared" ? undefined : walletAddress,
        forView === "shared" ? walletAddress : undefined,
      );
    }
  }, [wallet, forView]);

  return (
    //<AllSolanaContent>
    <div className="mx-auto flex w-full justify-center">
      <div className="flex h-full w-full max-w-[1250px] items-stretch gap-2">
        <div className="hidden min-w-[250px] px-1 md:block">
          <AddNewFileButton />
          <AppLeftSidenav
            links={sidenavItems}
            currentSelected={forView === "shared" ? "shared" : "home"}
          />
        </div>
        {forView === "shared" ? (
          <SharedFilesWithMe />
        ) : (
          <MyWalletFilesLayoutWrapper />
        )}
      </div>
      {(shouldShowAuthModal || !userInformation?.did_public_address) && (
        <OnboardingDialog />
      )}
    </div>
  );
};

export { MyWalletFiles };
