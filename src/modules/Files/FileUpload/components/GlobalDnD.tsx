import React from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { useWallet } from "@solana/wallet-adapter-react";
import ipfsClient from "./utils/IpfsConfiguration";
import { SIGN_MESSAGE } from "~/modules/Layout/components/CreateNewUser";
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
  const { manualSyncFileCreation } = useContractIndexer();
  const { mintToken } = useSaveFileDataOnChain();
  const { changeForcedUploadFiles } = useFilesStore();
  const getUniqueCredentials = async () => {
    const provider = window.solana;
    if (!provider) {
      alert("solana is not found.");

      return;
    }
    const encodedMessage = new TextEncoder().encode(SIGN_MESSAGE);

    // Request signature from the user
    const signedMessage = await provider.signMessage(encodedMessage);
    const seed = crypto
      .createHash("sha256")
      .update(signedMessage)
      .digest()
      .slice(0, 32);
    const keyPair = nacl.sign.keyPair.fromSeed(seed);
    const publicKeyString = bs58.encode(keyPair.publicKey);
    const privateKeyString = bs58.encode(keyPair.secretKey);
    return { publicKeyString, privateKeyString };
  };

  const encryptFile = async (
    content: any,
    fileName: string,
    size: number,
    destinationWallet?: string,
  ) => {
    //wallet.publicKey?.toString()
    const targetWallet = wallet.publicKey?.toString();

    const userDid = userInformation?.did_public_address!;
    const chunks = [];
    for await (const chunk of ipfsClient.cat(userDid)) {
      chunks.push(chunk);
    }
    const walletIpfsFileContent = Buffer.concat(chunks);
    const fileContentJson = JSON.parse(walletIpfsFileContent.toString());

    const { privateKeyString } = (await getUniqueCredentials()) || {};
    // Decode the private key string
    const privateKey = bs58.decode(privateKeyString);
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
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    const encryptedMessage = nacl.secretbox(encodedMessage, nonce, secretKey);

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
      from: targetWallet!,
      to: destinationWallet || targetWallet!,
    };
    await mintToken(newToken);
    toast(`New file ${fileName} created.`);
    await manualSyncFileCreation(newToken);
    changeForcedUploadFiles(false);
    // on create new file, reload all data
    getFilesByWallet(targetWallet!);
    return { cid: added.cid.toString() };
    // Example decryption (normally you would do this where you need the decrypted data)
    let letNewChunks = [];
    for await (const chunk of ipfsClient.cat(added.cid.toString())) {
      letNewChunks.push(chunk);
    }
    const fetchedEncryptedData = Buffer.concat(letNewChunks);
    const decryptedContent = nacl.secretbox.open(
      fetchedEncryptedData.slice(nacl.secretbox.nonceLength),
      fetchedEncryptedData.slice(0, nacl.secretbox.nonceLength),
      secretKey,
    );

    if (!decryptedContent) {
      console.error("Decryption failed");
      return;
    }

    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decryptedContent);
  };
  return { encryptFile };
};

function GlobalDnD() {
  const { encryptFile } = useEncryptionFileEncryption();

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop: async ([file]) => {
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
          Drag and drop your files here
        </span>
      </Container>
    </div>
  );
}

export { GlobalDnD };
