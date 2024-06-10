"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { AllSolanaContent } from "~/modules/Auth/components/WalletConnectionButton";
import { AppLeftSidenav } from "~/modules/Layout/components/AppLeftSidenav";
import sidenavItems from "~/modules/Layout/data/sidenav";
import { getIsUserSubscribed } from "~/modules/Store/Auth/selectors";
import { useAuthStore } from "~/modules/Store/Auth/store";
import { UpgradeAccountContent } from "~/modules/Subscription/components/UpgradeAccountModal";

const SettingsContent = () => {
  const isSubscribed = useAuthStore(getIsUserSubscribed);
  const wallet = useWallet();

  return (
    <AllSolanaContent>
      <div className="mx-auto flex w-full justify-center">
        <div className="flex w-full max-w-[1250px] gap-2">
          <div className="hidden min-w-[250px] px-1 md:block">
            <AppLeftSidenav links={sidenavItems} currentSelected={"settings"} />
          </div>
          <Card>
            <CardHeader className="space-between relative flex w-full flex-row">
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
    </AllSolanaContent>
  );
};

export default SettingsContent;
