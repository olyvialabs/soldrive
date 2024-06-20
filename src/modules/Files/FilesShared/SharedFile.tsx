"use client";

import { Button } from "~/components/ui/button";
import { FileListLoadingComponent } from "../FileDisplayer/components/MyWalletFiles";
import { useWallet } from "@solana/wallet-adapter-react";
import { MyWalletFilesInnerContent } from "../FileDisplayer/components/MyWalletFilesInnerContent";
import { PreviewFileDetails } from "../FileDetails/components/PreviewFileDetails";
import { EmptyPlaceholder } from "~/components/empty-placeholder";
import { ArrowLeftIcon, DownloadIcon, PersonIcon } from "@radix-ui/react-icons";
import useContractIndexer from "../hooks/useContractIndexer";
import { useEffect, useState } from "react";
import { FileDetails } from "../FileDisplayer/types";
import { useAuthStore } from "~/modules/Store/Auth/store";
import { AllSolanaContent } from "~/modules/Auth/components/WalletConnectionButton";
import { OnboardingDialog } from "~/modules/Layout/components/OnboardingDialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import useDownloadFiles from "../FileDisplayer/hooks/useDownloadFiles";
import Link from "next/link";

const useFileFromRoute = () => {
  const { getFileByCid } = useContractIndexer();
  const [currentFileData, setCurrentFileData] = useState<FileDetails | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getFilesByWalletFromIndexer = async (cid: string) => {
    setLoading(true);
    setError(null);

    const response = await getFileByCid(cid);

    if (response.success) {
      setCurrentFileData(response?.data || null);
    } else {
      setError(response?.error || "Unknown error");
    }

    setLoading(false);
  };

  return { getFilesByWalletFromIndexer, error, loading, currentFileData };
};

const SharedFile = ({ cid }: { cid: string }) => {
  const { getFilesByWalletFromIndexer, error, loading, currentFileData } =
    useFileFromRoute();
  const { shouldShowAuthModal, userInformation } = useAuthStore();
  const [isDownloadingFile, setIsDownloadingFile] = useState(false);
  const { downloadFiles } = useDownloadFiles();
  useEffect(() => {
    if (cid) {
      getFilesByWalletFromIndexer(cid);
    }
  }, [cid]);

  function downloadFile() {
    setIsDownloadingFile(true);
    downloadFiles(currentFileData!).finally(() => {
      setIsDownloadingFile(false);
    });
  }

  function bytesToMegabytes(bytes, decimals = 2) {
    const MB = 1024 * 1024;
    return (bytes / MB).toFixed(decimals);
  }

  if (error) {
    return (
      <div className="w-full">
        <p className="text-center">
          There was an error retrieving data from server
        </p>
        <div className="flex justify-center">
          <Button
            className="text-primary-500 mt-2"
            onClick={() => {
              getFilesByWalletFromIndexer(cid);
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
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

  if (!currentFileData) {
    return (
      <EmptyPlaceholder className="w-full">
        <EmptyPlaceholder.Icon>
          <PersonIcon className="h-4 w-4" />
        </EmptyPlaceholder.Icon>
        <EmptyPlaceholder.Title>No file found</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Are you sure you have a correct link for it?
        </EmptyPlaceholder.Description>
        <Button className="text-white">Go to App</Button>
      </EmptyPlaceholder>
    );
  }

  return (
    //<AllSolanaContent>
    <div className="mx-auto flex w-full justify-center">
      <div className="flex max-w-[1250px] gap-2">
        <div className="flex flex-col justify-center">
          <Card className="w-full max-w-md max-w-sm rounded-lg shadow-sm">
            <CardHeader className="pb-0">
              <Link href="/app">
                <Button variant="link" className="gap-1 p-0">
                  <ArrowLeftIcon />
                  Go back
                </Button>
              </Link>
              <img src="/app-logo.png" className="w-12" />
              <CardTitle className="mb-4 text-base">
                Descentralized File Transfer
              </CardTitle>
            </CardHeader>
            <div className="mt-2 flex flex-col space-y-2 break-all px-6">
              <span className="break-all">File: {currentFileData.name}</span>
              <span className="break-all">
                Size: {bytesToMegabytes(currentFileData.weight || 0)} MB
              </span>
              <span className="break-all pb-4 text-gray-500">
                You are downloading a file shared by{" "}
                <b className="text-purple-500">{currentFileData.from}</b>
              </span>
            </div>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <Button
                loading={isDownloadingFile}
                disabled={isDownloadingFile}
                className="w-full text-white"
                onClick={() => downloadFile()}
              >
                <DownloadIcon className="mr-1" /> Download
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      {(shouldShowAuthModal || !userInformation?.did_public_address) && (
        <OnboardingDialog />
      )}
    </div>
  );
};

export default SharedFile;
