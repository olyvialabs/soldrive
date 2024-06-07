"use client";

import { useFilesStore } from "../../../Store/FileDisplayLayout/store";
import { OnboardingDialog } from "~/modules/Layout/components/OnboardingDialog";
import { useAuthStore } from "~/modules/Store/Auth/store";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { AllSolanaContent } from "~/modules/Auth/components/WalletConnectionButton";
import { useUserFilesStore } from "~/modules/Store/UserFiles/store";
import SoldriveTransferInnerContent from "./SoldriveTransferInnerContent";
import useGetAllFilesByWalletIndexer from "../../FileDisplayer/hooks/useGetAllFilesByWalletIndexer";

const SoldriveTransferComponent = () => {
  const { setPreviewFileDetails, changeForcedUploadFiles } = useFilesStore();
  const { shouldShowAuthModal, userInformation, changeAuthModalVisibility } =
    useAuthStore();
  const wallet = useWallet();
  const { clearStore: clearUserFilesStore } = useUserFilesStore();
  const { getFilesByWallet } = useGetAllFilesByWalletIndexer();

  useEffect(() => {
    changeAuthModalVisibility(true);
    clearUserFilesStore();
    setPreviewFileDetails({ fileContent: null, fileId: "", isVisible: false });
    changeForcedUploadFiles(false);
  }, []);

  useEffect(() => {
    const walletAddress = wallet?.publicKey?.toString();
    if (walletAddress) {
      getFilesByWallet(walletAddress);
    }
  }, [wallet?.publicKey]);

  return (
    <AllSolanaContent>
      <div className="mx-auto flex w-full justify-center">
        <div className="flex max-w-[1250px] gap-2">
          <SoldriveTransferInnerContent />
        </div>
        {(shouldShowAuthModal || !userInformation?.did_public_address) && (
          <OnboardingDialog />
        )}
      </div>
    </AllSolanaContent>
  );
};

export default SoldriveTransferComponent;
