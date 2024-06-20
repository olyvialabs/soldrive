"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { WalletConnectionButton } from "~/modules/Auth/components/WalletConnectionButton";
import { useAuthStore } from "~/modules/Store/Auth/store";

export function AuthenticatedOptions({
  mobileDisplay,
}: {
  mobileDisplay?: boolean;
}) {
  const { userInformation } = useAuthStore();

  if (!userInformation) {
    if (mobileDisplay) {
      return (
        <div className="block w-full py-2">
          <WalletConnectionButton type="connect" />
        </div>
      );
    }

    return <WalletConnectionButton type="connect" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-primary">
          🙋‍♂️ My Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/app">
            <DropdownMenuItem>My files</DropdownMenuItem>
          </Link>
          <Link href="/shared">
            <DropdownMenuItem>Shared with me</DropdownMenuItem>
          </Link>
          <Link href="/transfer">
            <DropdownMenuItem>Transfer with Magic Link</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
        // onClick={() => {
        //   clearAuth();
        //   window.location.reload();
        // }}
        >
          <div className="flex flex-col">
            <WalletConnectionButton type="both" />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
