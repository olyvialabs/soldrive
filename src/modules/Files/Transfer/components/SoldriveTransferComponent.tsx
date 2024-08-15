"use client";

import { OnboardingDialog } from "~/modules/Layout/components/OnboardingDialog";
import { useAuthStore } from "~/modules/Store/Auth/store";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import SoldriveTransferInnerContent from "./SoldriveTransferInnerContent";
import useGetAllFilesByWalletIndexer from "../../FileDisplayer/hooks/useGetAllFilesByWalletIndexer";
import { useInitializeFilesStores } from "../../FileDisplayer/hooks/useInitializeFilesStores";

const SoldriveTransferComponent = () => {
  const { shouldShowAuthModal, userInformation } = useAuthStore();
  const wallet = useWallet();
  const { getFilesByWallet } = useGetAllFilesByWalletIndexer();
  const { clearFileRelatedStores } = useInitializeFilesStores();
  useEffect(() => {
    clearFileRelatedStores();
  }, []);

  useEffect(() => {
    const walletAddress = wallet?.publicKey?.toString();
    if (walletAddress) {
      getFilesByWallet(walletAddress);
    }
  }, [wallet?.publicKey]);

  return (
    <div className="z-0 mx-auto flex max-w-full flex-col justify-between px-2 md:w-[1250px] md:flex-row md:px-8">
      <div className="flex w-full">
        <div className="flex w-[1250px] max-w-full gap-2 py-24">
          <div className="flex w-full justify-between">
            <SoldriveTransferInnerContent forView="landing" />
            <div className="hidden flex-1 items-center justify-center md:flex">
              <video className="h-72 w-72" autoPlay loop muted>
                <source src={"/logo-animated.webm"} type="video/webm" />
              </video>
            </div>
          </div>
        </div>
        {/* {(shouldShowAuthModal || !userInformation?.did_public_address) && (
          <OnboardingDialog />
        )} */}
      </div>
    </div>
  );
};

export default SoldriveTransferComponent;
