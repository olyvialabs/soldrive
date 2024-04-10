import React from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import useGetAllUserData from "../../hooks/useGetAllUserData";
import { useWallet } from "@solana/wallet-adapter-react";
import ipfsClient from "./utils/IpfsConfiguration";
import { SIGN_MESSAGE } from "~/modules/Layout/components/CreateNewUser";
import nacl from "tweetnacl";
import bs58 from "bs58";
import crypto from "crypto";
import { FileIcon } from "@radix-ui/react-icons";
import { useSaveFileDataOnChain } from "./FileUploadButton";
import { AllSolanaContent } from "~/modules/Auth/components/WalletConnectionButton";

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

const useEncryptionFileEncryption = (usersData: Array<any>) => {
  const wallet = useWallet();

  const { mintToken, isLoading } = useSaveFileDataOnChain();
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

  const encryptFile = async (content: any, fileName: string, size: number) => {
    //wallet.publicKey?.toString()
    const targetWallet = wallet.publicKey?.toString();

    console.log({ targetWallet, usersData });
    console.log({ targetWallet, usersData });
    console.log({ targetWallet, usersData });
    const foundUser = (usersData || []).find(
      (item) => item["UserMetadata user_solana"] === targetWallet,
    );

    console.log({ usersData });
    console.log({ usersData });
    console.log({ usersData });

    if (!foundUser) {
      alert("User not found.");
      return;
    }

    const userDid = foundUser.did_public_address;
    const chunks = [];
    for await (const chunk of ipfsClient.cat(userDid)) {
      chunks.push(chunk);
    }
    const walletIpfsFileContent = Buffer.concat(chunks);
    const fileContentJson = JSON.parse(walletIpfsFileContent.toString());
    console.log(fileContentJson);

    const { privateKeyString } = await getUniqueCredentials();
    // Decode the private key string
    const privateKey = bs58.decode(privateKeyString);
    // Use the first 32 bytes of the private key as the shared secret
    const secretKey = privateKey.slice(0, 32);

    // Encrypt the file content
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(content);
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    const encryptedMessage = nacl.secretbox(encodedMessage, nonce, secretKey);
    const asdf = encryptedMessage;

    // Combine the nonce and the encrypted message
    const combined = new Uint8Array(nonce.length + encryptedMessage.length);
    combined.set(nonce);
    combined.set(encryptedMessage, nonce.length);

    // Upload the combined encrypted data to IPFS
    const added = await ipfsClient.add(combined);
    console.log("Encrypted file added to IPFS with CID:", added.cid.toString());

    await mintToken({
      name: fileName,
      cid: added.cid.toString(),
      file_parent_id: "",
      typ: "file",
      weight: size,
    });

    return;
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
    console.log("Decrypted content:", decryptedString);
  };
  return { encryptFile };
};

function GlobalDnD() {
  const { data: usersData, loading: userDataLoading } = useGetAllUserData();
  const { encryptFile } = useEncryptionFileEncryption(usersData);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop: async ([file]) => {
        var reader = new FileReader();
        reader.onload = async function (e) {
          await encryptFile(
            e.target?.result,
            file?.name || "Unknown",
            file?.size || 0,
          );
        };
        reader.readAsText(file);
      },
    });

  if (userDataLoading) {
    return <div>Cargåndo</div>;
  }

  return (
    <AllSolanaContent>
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
    </AllSolanaContent>
  );
}

export { GlobalDnD };
