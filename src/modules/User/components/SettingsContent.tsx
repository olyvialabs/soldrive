"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  AllSolanaContent,
  WalletConnectionButton,
} from "~/modules/Auth/components/WalletConnectionButton";
import { AppLeftSidenav } from "~/modules/Layout/components/AppLeftSidenav";
import { OnboardingDialog } from "~/modules/Layout/components/OnboardingDialog";
import sidenavItems from "~/modules/Layout/data/sidenav";
import { getIsUserSubscribed } from "~/modules/Store/Auth/selectors";
import { useAuthStore } from "~/modules/Store/Auth/store";
import { UpgradeAccountContent } from "~/modules/Subscription/components/UpgradeAccountModal";

const SettingsContent = () => {
  const isSubscribed = useAuthStore(getIsUserSubscribed);
  const wallet = useWallet();
  const { userInformation, shouldShowAuthModal } = useAuthStore();
  return (
    //   <AllSolanaContent>
    <>
      <div className="mx-auto flex w-full justify-center">
        <div className="flex w-full max-w-[1250px] gap-2">
          <div className="hidden min-w-[250px] px-1 md:block">
            <AppLeftSidenav links={sidenavItems} currentSelected={"settings"} />
          </div>
          <div>
            <Card>
              <CardHeader className="space-between relative flex w-full flex-row text-xl md:text-2xl">
                Your information
              </CardHeader>
              <CardContent className="break-all px-2 md:px-6">
                <div className="break-all">
                  Username:{" "}
                  <b className="text-purple-500">{userInformation?.username}</b>{" "}
                </div>
                <div className="my-2 break-all">
                  Wallet:{" "}
                  <b className="text-purple-500">
                    {userInformation?.user_solana}
                  </b>
                </div>
                <div className=" flex flex-col gap-2 md:flex-row">
                  <WalletConnectionButton type="connect" />
                  <WalletConnectionButton type="disconnect" />
                </div>{" "}
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardHeader className="space-between relative flex w-full flex-row text-xl md:text-2xl">
                Subscription Status
              </CardHeader>
              <CardContent className="px-2 md:px-6">
                <div className="text-xs text-gray-500">
                  Logged in as <b> {wallet?.publicKey?.toString()}</b>
                </div>
                {isSubscribed ? (
                  <span>
                    You currently have a subscription that expires on June 19th,
                    2024.
                  </span>
                ) : (
                  <UpgradeAccountContent />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {(shouldShowAuthModal || !userInformation?.did_public_address) && (
        <OnboardingDialog />
      )}
    </>
  );
};

export default SettingsContent;
