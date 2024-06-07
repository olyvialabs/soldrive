"use client";

import { Button } from "~/components/ui/button";
import { FileListLoadingComponent } from "../FileDisplayer/components/MyWalletFiles";
import { useWallet } from "@solana/wallet-adapter-react";
import useGetAllFilesByWalletIndexer from "../FileDisplayer/hooks/useGetAllFilesByWalletIndexer";
import { useUserFilesStore } from "~/modules/Store/UserFiles/store";
import { MyWalletFilesInnerContent } from "../FileDisplayer/components/MyWalletFilesInnerContent";
import { PreviewFileDetails } from "../FileDetails/components/PreviewFileDetails";
import { EmptyPlaceholder } from "~/components/empty-placeholder";
import { PersonIcon } from "@radix-ui/react-icons";

const SharedFilesWithMe = () => {
  const { errorRetrieving, isRetrievingFiles } = useUserFilesStore();
  const { getFilesByWallet } = useGetAllFilesByWalletIndexer();
  const wallet = useWallet();
  const { files: walletFiles } = useUserFilesStore();
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
              getFilesByWallet(undefined, wallet?.publicKey?.toString()!);
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

  if (!walletFiles?.length) {
    return (
      <EmptyPlaceholder className="w-full">
        <EmptyPlaceholder.Icon>
          <PersonIcon className="h-4 w-4" />
        </EmptyPlaceholder.Icon>
        <EmptyPlaceholder.Title>
          Nothing shared with you yet
        </EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You will see all files shared with you here.
        </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    );
  }

  return (
    <>
      <MyWalletFilesInnerContent />
      <PreviewFileDetails />
    </>
  );
};

export default SharedFilesWithMe;
