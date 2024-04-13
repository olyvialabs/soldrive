import React, { useEffect, useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { useWallet } from "@solana/wallet-adapter-react";
import CreateUserButton from "./CreateNewUser";
import { useAuthStore } from "~/modules/Auth/store/store";
import useGetAllUserData from "~/modules/Files/hooks/useGetAllUserData";

const SolanaLogFetcher: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const { changeAuthModalVisibility } = useAuthStore();
  const wallet = useWallet();
  const { loading: usersDataLoading, data: usersData } = useGetAllUserData();

  useEffect(() => {
    if ((usersData || []).length > 0) {
      const foundUser = usersData!.find(
        (item) =>
          item["UserMetadata user_solana"] === wallet.publicKey?.toString(),
      );
      if (foundUser) {
        changeAuthModalVisibility(false);
      }
      setIsLoading(false);
      setIsNewUser(!foundUser);
    }
  }, [usersData, wallet]);

  if (isLoading || usersDataLoading || !usersData?.length) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>{isNewUser && <CreateUserButton />} </div>
    </div>
  );
};

export default SolanaLogFetcher;
