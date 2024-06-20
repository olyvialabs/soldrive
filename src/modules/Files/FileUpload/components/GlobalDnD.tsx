import React from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { useWallet } from "@solana/wallet-adapter-react";
import ipfsClient from "./utils/IpfsConfiguration";
import nacl from "tweetnacl";
import bs58 from "bs58";
import crypto from "crypto";
import { FileIcon } from "@radix-ui/react-icons";
import { useSaveFileDataOnChain } from "./FileUploadButton";
import { AllSolanaContent } from "~/modules/Auth/components/WalletConnectionButton";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { useAuthStore } from "~/modules/Store/Auth/store";
import { useUserFilesStore } from "~/modules/Store/UserFiles/store";
import useGetAllFilesByWalletIndexer from "../../FileDisplayer/hooks/useGetAllFilesByWalletIndexer";
import useContractIndexer from "../../hooks/useContractIndexer";
import { useFilesStore } from "~/modules/Store/FileDisplayLayout/store";
import { getIsUserSubscribed } from "~/modules/Store/Auth/selectors";
import useGetAuthenticatedWalletKeys from "~/modules/User/hooks/useGetAuthenticatedWalletKeys";

const getColor = (props) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  // if (props.isDragReject) {
  //   return "#ff1744";
  // }
  if (props.isFocused) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const Container = styled.div``;

export const useEncryptionFileEncryption = () => {
  const wallet = useWallet();
  const { currentFolderInformation } = useFilesStore();
  const { userInformation } = useAuthStore();
  const { getFilesByWallet } = useGetAllFilesByWalletIndexer();
  const { manualSyncFileCreation, getUserByWallet } = useContractIndexer();
  const { mintToken } = useSaveFileDataOnChain();
  const { changeForcedUploadFiles } = useFilesStore();
  const { generateUniqueCredentials } = useGetAuthenticatedWalletKeys();

  const encryptFile = async (
    content: any,
    fileName: string,
    size: number,
    destinationWallet?: string,
  ) => {
    const myUserWallet = wallet.publicKey?.toString();

    const myUserDid = userInformation?.did_public_address!;
    // let otherUserDid = userInformation?.did_public_address!;
    // const isDestinationOtherAddress = myUserWallet !== destinationWallet;
    // if (isDestinationOtherAddress) {
    //   const otherAddrInfo = await getUserByWallet({
    //     walletAddress: destinationWallet!,
    //   });
    //   if (!otherAddrInfo.success || !otherAddrInfo.data?.did_public_address) {
    //     toast("There was an issue with user DID retrieval", {
    //       description:
    //         "Please try again. Contact support if this issue persist.",
    //     });
    //     return;
    //   }
    //   otherUserDid = otherAddrInfo.data?.did_public_address!;
    // }
    const ipfsFileContentChunks = [];
    for await (const chunk of ipfsClient.cat(myUserDid)) {
      ipfsFileContentChunks.push(chunk);
    }
    const walletIpfsFileContent = Buffer.concat(ipfsFileContentChunks);
    const fileContentJson = JSON.parse(walletIpfsFileContent.toString());

    const { privateKeyString } = await generateUniqueCredentials();
    // Decode the private key string
    const privateKey = bs58.decode(privateKeyString!);
    // Use the first 32 bytes of the private key as the shared secret
    const secretKey = privateKey.slice(0, 32);

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

    // @TODO:
    // This key must be encrypted based on b58
    // instead of TextEncoder
    const destinationPublicKey = encoder.encode(fileContentJson);
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    const encryptedMessage = nacl.secretbox(
      encodedMessage,
      nonce,
      ///destinationPublicKey,
      secretKey,
    );

    // Combine the nonce and the encrypted message
    const combined = new Uint8Array(nonce.length + encryptedMessage.length);
    combined.set(nonce);
    combined.set(encryptedMessage, nonce.length);

    // Upload the combined encrypted data to IPFS
    const added = await ipfsClient.add(combined);

    const newToken = {
      name: fileName,
      cid: added.cid.toString(),
      file_parent_id: currentFolderInformation.fileData?.id || "",
      typ: "file",
      weight: size,
      from: myUserWallet!,
      to: destinationWallet || myUserWallet!,
    };
    await mintToken(newToken);
    toast(`New file ${fileName} created.`);
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
            const contentAsUint8Array =
              typeof contentAsArrayBuffer === "string"
                ? contentAsArrayBuffer
                : new Uint8Array(contentAsArrayBuffer);
            await encryptFile(
              contentAsUint8Array,
              file?.name || "Unknown",
              file?.size || 0,
            );
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
        className="relative flex min-h-[40vh] w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-100 border-gray-200 p-12 text-center dark:border-gray-800"
        style={{
          backgroundImage: "radial-gradient(var(--gradient-9))",
        }}
      >
        <input {...getInputProps()} />
        <FileIcon className="h-8 w-8" />{" "}
        <span className="text-sm font-semibold tracking-wide">
          Drag and drop your files here.{" "}
          {isSubscribed
            ? "Unlimited size for PRO plan"
            : "Up to 10MB for free plan"}
        </span>
      </Container>
    </div>
  );
}

export { GlobalDnD };
