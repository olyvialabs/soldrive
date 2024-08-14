import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { useWallet } from "@solana/wallet-adapter-react";
import ipfsClient from "./utils/IpfsConfiguration";
import { FileIcon, FileMinusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useSaveFileDataOnChain } from "./FileUploadButton";
import { toast } from "sonner";
import { UserInformationData, useAuthStore } from "~/modules/Store/Auth/store";
import useGetAllFilesByWalletIndexer from "../../FileDisplayer/hooks/useGetAllFilesByWalletIndexer";
import useContractIndexer from "../../hooks/useContractIndexer";
import { useFilesStore } from "~/modules/Store/FileDisplayLayout/store";
import { getIsUserSubscribed } from "~/modules/Store/Auth/selectors";
import { encrypt as eciesEncrypt } from "eciesjs";

const Container = styled.div``;

export const useEncryptionFileEncryption = () => {
  const wallet = useWallet();
  const { currentFolderInformation } = useFilesStore();
  const { userInformation } = useAuthStore();
  const { getFilesByWallet } = useGetAllFilesByWalletIndexer();
  const { manualSyncFileCreation } = useContractIndexer();
  const { mintToken } = useSaveFileDataOnChain();
  const { changeForcedUploadFiles } = useFilesStore();

  const encryptFile = async (
    content: any,
    fileName: string,
    size: number,
    destinationUser?: UserInformationData,
  ) => {
    const myUserWallet = wallet.publicKey?.toString();
    destinationUser = destinationUser || userInformation!;
    const publicKey = destinationUser?.did_public_key!;

    // Encrypt the file content
    const encoder = new TextEncoder();
    let encodedMessage;
    if (content instanceof Uint8Array) {
      // If content is already a Uint8Array, use it directly
      encodedMessage = content;
    } else {
      // Otherwise, assume it's a string and encode it
      encodedMessage = encoder.encode(content);
    }
    const encryptedMessage = eciesEncrypt(publicKey, encodedMessage);

    // Upload the combined encrypted data to IPFS
    const added = await ipfsClient.add(encryptedMessage);

    const newToken = {
      name: fileName,
      cid: added.cid.toString(),
      file_parent_id: currentFolderInformation.fileData?.id || "",
      typ: "file",
      weight: size,
      from: myUserWallet!,
      to: destinationUser?.user_solana!, //destinationWallet || myUserWallet!,
    };
    await mintToken(newToken);
    toast(`New file ${fileName} created.`);
    console.log(`New file ${fileName} created.`);
    await manualSyncFileCreation(newToken);
    changeForcedUploadFiles(false);
    // on create new file/folder, reload all data
    getFilesByWallet(myUserWallet!);
    return { cid: added.cid.toString() };
  };
  return { encryptFile };
};

function GlobalDnD() {
  const { encryptFile } = useEncryptionFileEncryption();
  const isSubscribed = useAuthStore(getIsUserSubscribed);
  const [isLoading, setIsLoading] = useState(false);
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop: async ([file]) => {
        const tenMB = 10_485_760;
        if (file?.size > tenMB && !isSubscribed) {
          toast("10 MB limit for free plan reached", {
            description:
              "The current file exceds the limit size for free plan, select other file.",
            position: "top-center",
            icon: <FileMinusIcon />,
          });
          return;
        }

        var reader = new FileReader();
        reader.onload = async function (e) {
          const contentAsArrayBuffer = e.target?.result;
          if (contentAsArrayBuffer) {
            try {
              setIsLoading(true);
              const contentAsUint8Array =
                typeof contentAsArrayBuffer === "string"
                  ? contentAsArrayBuffer
                  : new Uint8Array(contentAsArrayBuffer);
              await encryptFile(
                contentAsUint8Array,
                file?.name || "Unknown",
                file?.size || 0,
              );
            } catch (error) {
              console.log({ error });
            } finally {
              setIsLoading(false);
            }
          }
        };
        reader.readAsArrayBuffer(file);
      },
    });

  // <AllSolanaContent>
  return (
    <div className="container">
      <Container
        {...getRootProps({ isFocused, isDragAccept, isDragReject })}
        className="relative flex min-h-[40vh] w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-100 border-gray-200 p-12 dark:border-gray-800"
        style={{
          backgroundImage: "radial-gradient(var(--gradient-9))",
        }}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <ReloadIcon className="h-12 w-12 animate-spin" />
        ) : (
          <div className="flex flex-row gap-2">
            <FileIcon className="h-8 w-8" />
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-semibold tracking-wide">
                Drag and drop your files here.{" "}
              </span>
              <span>
                <b className="text-purple-500">Current plan: </b>
                {isSubscribed
                  ? "unlimited size with PRO plan"
                  : "up to 10MB for free plan"}
              </span>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export { GlobalDnD };
