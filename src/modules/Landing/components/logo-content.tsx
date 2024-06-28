"use client";

import Link from "next/link";
import Logo from "~/components/general/logo";
import { useAuthStore } from "~/modules/Store/Auth/store";

const LogoContent = () => {
  const { userInformation } = useAuthStore();
  return (
    <Link href={userInformation?.user_solana ? "/app" : "/"}>
      <div className="flex cursor-pointer flex-row items-center justify-center gap-2">
        <Logo />
        <span className="font-bold hover:underline">SOLDRIVE</span>
      </div>
    </Link>
  );
};

export default LogoContent;
