import nacl from "tweetnacl";
import ipfsClient from "../../FileUpload/components/utils/IpfsConfiguration";
import { useFilesStore } from "../../../Store/FileDisplayLayout/store";
import bs58 from "bs58";
import { SIGN_MESSAGE } from "~/modules/Layout/components/CreateNewUser";
import crypto from "crypto";
import { useAuthStore } from "~/modules/Store/Auth/store";
import { useUserFilesStore } from "~/modules/Store/UserFiles/store";
import { FileDetails } from "../types";

const useDownloadFiles = () => {
  const { fileSelection } = useFilesStore();
  const { files: allFiles } = useUserFilesStore();
  const { userInformation } = useAuthStore();
  const getUniqueCredentials = async () => {
    const provider = window.solana;
    if (!provider) {
      alert("solana is not found.");

      return;
    }
    await provider.connect();
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

  const downloadFiles = async (paramFile?: FileDetails) => {
    const userDid = userInformation?.did_public_address!;
    const chunks = [];
    for await (const chunk of ipfsClient.cat(userDid)) {
      chunks.push(chunk);
    }
    //const walletIpfsFileContent = Buffer.concat(chunks);
    //const fileContentJson = JSON.parse(walletIpfsFileContent.toString());
    const downloadSpecificFile = async (fileId: string) => {
      const foundItem = paramFile
        ? paramFile
        : allFiles.find((item) => item.id === fileId);

      if (!foundItem || foundItem.typ === "folder") {
        return;
      }

      try {
        const chunks = [];
        for await (const chunk of ipfsClient.cat(foundItem.cid)) {
          chunks.push(chunk);
        }
        // const ipfsFileContent = Buffer.concat(chunks);
        // const walletIpfsFileContent = Buffer.concat(chunks);

        const { privateKeyString } = await getUniqueCredentials();
        // Decode the private key string
        const privateKey = bs58.decode(privateKeyString);
        // Use the first 32 bytes of the private key as the shared secret
        const secretKey = privateKey.slice(0, 32);

        const fetchedEncryptedData = Buffer.concat(chunks);
        const decryptedContent = nacl.secretbox.open(
          fetchedEncryptedData.slice(nacl.secretbox.nonceLength),
          fetchedEncryptedData.slice(0, nacl.secretbox.nonceLength),
          secretKey,
        );

        if (!decryptedContent) {
          console.error("Decryption failed");
          return;
        }

        let contentType = "application/octet-stream";
        var blob = new Blob([decryptedContent], {
          type: contentType,
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = foundItem.name;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error retrieving file content:", error);
        throw error;
      }
    };
    if (!paramFile) {
      for (let fileId of fileSelection.filesSelected) {
        await downloadSpecificFile(fileId);
      }
    } else {
      await downloadSpecificFile(paramFile.id);
    }
  };

  return { downloadFiles };
};

export default useDownloadFiles;
