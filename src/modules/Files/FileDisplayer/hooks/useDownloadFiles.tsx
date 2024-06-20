import nacl from "tweetnacl";
import ipfsClient from "../../FileUpload/components/utils/IpfsConfiguration";
import { useFilesStore } from "../../../Store/FileDisplayLayout/store";
import bs58 from "bs58";
import { useAuthStore } from "~/modules/Store/Auth/store";
import { useUserFilesStore } from "~/modules/Store/UserFiles/store";
import { FileDetails } from "../types";
import useGetAuthenticatedWalletKeys from "~/modules/User/hooks/useGetAuthenticatedWalletKeys";
import { toast } from "sonner";

const useDownloadFiles = () => {
  const { fileSelection } = useFilesStore();
  const { files: allFiles } = useUserFilesStore();
  const { userInformation } = useAuthStore();
  const { generateUniqueCredentials } = useGetAuthenticatedWalletKeys();

  const downloadSpecificFile = async (
    fileId: string,
    privateKeyString: string,
    // publicKeyString?: string,
    options?: { specificTargetedFile?: FileDetails; returnBlob?: boolean },
  ) => {
    const foundItem = options?.specificTargetedFile
      ? options?.specificTargetedFile
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

      // Decode the private key string
      const privateKey = bs58.decode(privateKeyString!);
      // Use the first 32 bytes of the private key as the shared secret
      const secretKey = privateKey.slice(0, 32);
      const fetchedEncryptedData = Buffer.concat(chunks);
      const decryptedContent = nacl.secretbox.open(
        fetchedEncryptedData.slice(nacl.secretbox.nonceLength),
        fetchedEncryptedData.slice(0, nacl.secretbox.nonceLength),
        // publicKeyString,
        secretKey,
      );

      if (!decryptedContent) {
        toast("You don't have permissions to download this file", {
          description: "Ask for permissions to the owner first!",
        });
        return;
      }

      let contentType = "application/octet-stream";
      var blob = new Blob([decryptedContent], {
        type: contentType,
      });
      if (options?.returnBlob) {
        return blob;
      }
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
  const downloadFiles = async (specificTargetedFile?: FileDetails) => {
    const userDid = userInformation?.did_public_address!;
    const chunks = [];
    for await (const chunk of ipfsClient.cat(userDid)) {
      chunks.push(chunk);
    }

    const { privateKeyString } = await generateUniqueCredentials();
    if (!specificTargetedFile) {
      for (let fileId of fileSelection.filesSelected) {
        await downloadSpecificFile(fileId, privateKeyString);
      }
    } else {
      await downloadSpecificFile(
        specificTargetedFile.id, // we don't care, we care about specificTargetedFile
        privateKeyString,
        { specificTargetedFile },
      );
    }
  };

  return { downloadFiles, downloadSpecificFile };
};

export default useDownloadFiles;
