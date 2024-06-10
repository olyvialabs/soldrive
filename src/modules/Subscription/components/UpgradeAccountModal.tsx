"use client";

import { Dialog, DialogContent, DialogHeader } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import useContractIndexer from "~/modules/Files/hooks/useContractIndexer";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { useAuthStore } from "~/modules/Store/Auth/store";
import UpgradeToProButton from "./UpgradeToProButton";

export const UpgradeAccountContent = ({
  onUpgrade,
}: {
  onUpgrade?: () => void;
}) => {
  const { getUserSubscriptionByWallet } = useContractIndexer();
  const { setSubscriptionTimestamp } = useAuthStore();
  const wallet = useWallet();

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <div>
          <DialogHeader>
            <p className="text-2xl font-bold">Free Plan</p>
            <p>The free plan allows you to upload files up to 100 MB.</p>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-green-500" />
              <span>100 MB file upload limit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-green-500" />
              <span>Basic collaboration tools</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-green-500" />
              <span>Limited storage space</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <span>Your current plan</span>
          {/* <Button variant="ghost" size="lg">
            Start for free
          </Button> */}
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <div>
            <p className="text-2xl font-bold">PRO Plan</p>
            <p>
              The PRO plan allows you to upload files larger than 100 MB and
              provides advanced collaboration tools.
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-green-500" />
              <span>Unlimited file upload size</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-green-500" />
              <span>Advanced collaboration tools</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-green-500" />
              <span>Unlimited storage space</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-green-500" />
              <span>Priority support</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          {/* <Button
            className="w-full text-white md:w-auto"
            loading={loading}
            onClick={async () => {
              setLoading(true);
              const response = await getUserSubscriptionByWallet(
                wallet?.publicKey?.toString() || "",
              );
              // @TODO: validate timestamp of 30 days is not reached yet
              if (response.data?.id) {
                setSubscriptionTimestamp(response?.data?.timestamp || 0);
              }
              setLoading(false);
              onUpgrade?.();
            }}
          >
            Upgrade to PRO
          </Button> */}
          <UpgradeToProButton
            onUpgrade={async () => {
              const response = await getUserSubscriptionByWallet(
                wallet?.publicKey?.toString() || "",
              );
              // @TODO: validate timestamp of 30 days is not reached yet
              if (response.data?.id) {
                setSubscriptionTimestamp(response?.data?.timestamp || 0);
              }
              onUpgrade?.();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function UpgradeAccountModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (newValue: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[600px]">
        <UpgradeAccountContent onUpgrade={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
