"use client";

import dynamic from "next/dynamic";
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
          <DropdownMenuItem>My files</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
        // onClick={() => {
        //   clearAuth();
        //   window.location.reload();
        // }}
        >
          <WalletConnectionButton type="disconnect" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
