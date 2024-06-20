"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ArrowLeftIcon,
  FileMinusIcon,
  FilePlusIcon,
  InputIcon,
  PersonIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "~/components/ui/input";
import UpgradeAccountModal from "~/modules/Subscription/components/UpgradeAccountModal";
import { useAuthStore } from "~/modules/Store/Auth/store";
import { getIsUserSubscribed } from "~/modules/Store/Auth/selectors";
import { useEncryptionFileEncryption } from "../../FileUpload/components/GlobalDnD";
import { toast } from "sonner";
import { env } from "~/env";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { useFilesStore } from "~/modules/Store/FileDisplayLayout/store";
import useDownloadFiles from "../../FileDisplayer/hooks/useDownloadFiles";
import { useUserFilesStore } from "~/modules/Store/UserFiles/store";
import useGetAuthenticatedWalletKeys from "~/modules/User/hooks/useGetAuthenticatedWalletKeys";
import useContractIndexer from "../../hooks/useContractIndexer";

type ForView = "landing" | "dialog";
const TransferInnerContentHeader = ({ forView }: { forView: ForView }) => {
  if (forView == "dialog") {
    return null;
  }
  return (
    <CardHeader className="pb-0">
      <Link href="/app">
        <Button variant="link" className="gap-1 p-0">
          <ArrowLeftIcon />
          Go back
        </Button>
      </Link>
      <img src="/app-logo.png" className="w-12" />
      <CardTitle className="text-base">Descentralized File Transfer</CardTitle>
    </CardHeader>
  );
};
const SoldriveTransferInnerContent = ({ forView }: { forView: ForView }) => {
  const wallet = useWallet();
  const isSubscribed = useAuthStore(getIsUserSubscribed);
  const [isUpgradeModalOpened, setIsUpgradeModalOpened] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
  }>(null);
  const { getUserByWallet } = useContractIndexer();
  const [destinationWallet, setDestinationWallet] = useState("");
  const { encryptFile } = useEncryptionFileEncryption();
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [generatedCid, setGeneratedCid] = useState("");
  const { files: allFiles } = useUserFilesStore();
  const { fileSelection } = useFilesStore();
  const { downloadSpecificFile } = useDownloadFiles();
  const { generateUniqueCredentials } = useGetAuthenticatedWalletKeys();
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const sendFile = async () => {
    if (!selectedFile && forView === "landing") {
      toast("Select a file first to continue", {
        position: "top-center",
        icon: <FilePlusIcon />,
      });
      return;
    }
    if (!destinationWallet) {
      toast("Add a destination wallet address to continue", {
        position: "top-center",
        icon: <InputIcon />,
      });
      return;
    }

    const destinationUserInfo = await getUserByWallet({
      walletAddress: destinationWallet,
    });

    if (
      !destinationUserInfo?.success ||
      !destinationUserInfo?.data?.did_public_address
    ) {
      toast("This address haven't registered into the app", {
        description: "Notify them or wait for them to start sending messages",
        position: "top-center",
        icon: <PersonIcon />,
      });
      return;
    }
    if (forView === "dialog") {
      const { privateKeyString } = await generateUniqueCredentials();
      let promises = [];
      for (const fileId of fileSelection.filesSelected) {
        promises.push(
          downloadSpecificFile(fileId, privateKeyString, { returnBlob: true }),
        );
      }
      const downloadPromises = await Promise.allSettled(promises);
      // we filter failed txs, and empty values
      let validFilesConstructed = [];
      for (let i = 0; i < downloadPromises.length; i++) {
        const iterativeBlob =
          downloadPromises[i]?.status === "fulfilled"
            ? (downloadPromises[i]?.value as Blob)
            : undefined;
        if (iterativeBlob) {
          validFilesConstructed.push({
            fileId: fileSelection.filesSelected[i],
            blob: iterativeBlob,
          });
        }
      }
      // now from the downloaded files, we just send it to the other users
      if (validFilesConstructed.length) {
        const shareFilePromises = [];
        for (const { fileId, blob } of validFilesConstructed) {
          const foundItem = allFiles.find((item) => item.id === fileId);
          const fileUint8Array = new Uint8Array(await blob.arrayBuffer());
          shareFilePromises.push(
            encryptFile(
              fileUint8Array,
              foundItem?.name || "Unknown",
              foundItem?.weight || 0,
              destinationWallet,
            ),
          );
        }
        const sharePromisesResponse =
          await Promise.allSettled(shareFilePromises);

        const sumShared = sharePromisesResponse.filter(
          (item) => item.status === "fulfilled",
        ).length;
        toast("Files shared!", {
          description: `${sumShared}/${sharePromisesResponse.length} Files shared to ${destinationWallet}`,
        });
        setDestinationWallet("");
        setIsUploadingFile(false);
      } else {
        toast("You can't share this files, try selecting files only for now");
        setIsUploadingFile(false);
      }
      return;
    }

    const tenMB = 10_485_760;
    if (selectedFile?.size > tenMB && !isSubscribed) {
      toast("10 MB limit for free plan reached", {
        description:
          "The current file exceds the limit size for free plan, select other file.",
        position: "top-center",
        icon: <FileMinusIcon />,
      });
      return;
    }
    // else, if paid, it just ignore the limit
    setIsUploadingFile(true);
    var reader = new FileReader();
    reader.onload = async function (e) {
      const contentAsArrayBuffer = e.target?.result;
      if (contentAsArrayBuffer) {
        const contentAsUint8Array =
          typeof contentAsArrayBuffer === "string"
            ? contentAsArrayBuffer
            : new Uint8Array(contentAsArrayBuffer);
        const encrypedFile = await encryptFile(
          contentAsUint8Array,
          selectedFile?.name || "Unknown",
          selectedFile?.size || 0,
          destinationWallet,
        );
        setGeneratedCid(encrypedFile?.cid || "");
        setIsUploadingFile(false);
        setSelectedFile(null);
        setDestinationWallet("");
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const newLink = `${env.NEXT_PUBLIC_APP_URL}/file/${generatedCid}`;
  const content = (
    <>
      <UpgradeAccountModal
        open={isUpgradeModalOpened}
        onOpenChange={setIsUpgradeModalOpened}
      />
      <Card
        className={cn(
          forView === "dialog"
            ? "w-full border-none shadow-none"
            : "w-full max-w-sm rounded-lg shadow-sm",
        )}
      >
        <TransferInnerContentHeader forView={forView} />
        {generatedCid ? (
          <div className="my-4 px-4">
            <CardDescription className="text-sm">
              <p>File was sent correctly. You can access this via this link:</p>
              <a
                href={newLink}
                target="_blank"
                className="break-all text-purple-500"
              >
                {newLink}
              </a>
            </CardDescription>
          </div>
        ) : (
          <>
            {forView === "landing" && (
              <>
                <div className="mt-4 px-4">
                  <CardHeader
                    onClick={() => {
                      document.getElementById("file-upload").click();
                    }}
                    className="flex cursor-pointer flex-row items-center space-x-2 rounded-lg border p-4 hover:bg-accent"
                  >
                    <PlusCircledIcon />
                    <div>
                      <CardTitle className="text-base">Upload files</CardTitle>
                      <CardDescription className="text-sm">
                        Click here to select your file
                      </CardDescription>
                    </div>
                  </CardHeader>
                </div>
                <div className="px-4">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {selectedFile && (
                    <div className="mt-4 flex w-fit items-center space-x-2 rounded-lg border px-2 py-1">
                      <span>{selectedFile.name}</span>
                      <button
                        className="text-red-500"
                        onClick={handleRemoveFile}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            <CardContent className="flex flex-col px-4 pb-4">
              {isSubscribed ? (
                <div className="mb-4">
                  <span className="text-xs text-gray-500">
                    You have PRO plan. You don't have a limit for each file.
                  </span>
                </div>
              ) : (
                <div className="mb-4 flex items-center justify-between">
                  <span className="mt-2 text-xs text-gray-500">
                    Up to 10 MB per file on free plan.
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsUpgradeModalOpened(true);
                    }}
                  >
                    Increase limit
                  </Button>
                </div>
              )}
              <div className="flex flex-col space-y-4">
                <div>
                  <Label htmlFor="to" className="text-sm">
                    Destination wallet address:
                  </Label>
                  <Input
                    id="to"
                    placeholder="To whom"
                    onChange={(e) => {
                      setDestinationWallet(e.target.value);
                    }}
                    value={destinationWallet}
                  />
                </div>
                <div className="mt-2 flex flex-col">
                  <Label className="text-sm">Your wallet</Label>
                  <div className="">
                    <span className="break-all text-sm font-bold">
                      {wallet?.publicKey ? wallet.publicKey.toString() : ""}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <Button
                loading={isUploadingFile}
                disabled={isUploadingFile}
                className="w-full text-white"
                onClick={() => sendFile()}
              >
                Send
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </>
  );
  if (forView === "landing") {
    return <div className="flex flex-col justify-center">{content}</div>;
  }
  return content;
};

// 5KqPscmVdEYJ9HmQdymcBvpfi515debCGUmpgoH6sEn4

export default SoldriveTransferInnerContent;
