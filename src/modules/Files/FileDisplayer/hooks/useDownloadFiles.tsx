import nacl from "tweetnacl";
import ipfsClient from "../../FileUpload/components/utils/IpfsConfiguration";
import { useFilesStore } from "../../../Store/FileDisplayLayout/store";
import bs58 from "bs58";
import { useAuthStore } from "~/modules/Store/Auth/store";
import { useUserFilesStore } from "~/modules/Store/UserFiles/store";
import { FileDetails } from "../types";
import useGetAuthenticatedWalletKeys from "~/modules/User/hooks/useGetAuthenticatedWalletKeys";
import { toast } from "sonner";
import useContractIndexer from "../../hooks/useContractIndexer";

const useDownloadFiles = () => {
  const { fileSelection } = useFilesStore();
  const { files: allFiles } = useUserFilesStore();
  const { userInformation } = useAuthStore();
  const { generateUniqueCredentials } = useGetAuthenticatedWalletKeys();
  const { getUserByWallet } = useContractIndexer();
  const downloadSpecificFile = async (
    fileId: string,
    publicKeyUserDid: string,
    privateKeyUserDid: string,
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
      const privateKey = bs58.decode(privateKeyUserDid!).slice(0, 32);
      // Use the first 32 bytes of the private key as the shared secret
      const publicKey = bs58.decode(publicKeyUserDid!).slice(0, 32);
      const fetchedEncryptedData = Buffer.concat(chunks);
      console.log({ privateKey });
      console.log({ privateKey });
      console.log({ privateKey });
      const decryptedContent = nacl.box.open(
        fetchedEncryptedData.slice(nacl.box.nonceLength),
        fetchedEncryptedData.slice(0, nacl.box.nonceLength),
        publicKey,
        privateKey,
      );
      console.log({});
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
    // defualts to the actual user
    const fromWallet = await getUserByWallet({
      walletAddress: specificTargetedFile?.from!,
    });
    if (fromWallet.error || !fromWallet.success) {
      toast("There was an issue retrieving destination user information", {
        description: "Try again later",
      });
      return;
    }

    // const walletIpfsFileContent = Buffer.concat(ipfsFileContentChunks);
    // const fileContentJson = JSON.parse(walletIpfsFileContent.toString());

    const { privateKeyString } = await generateUniqueCredentials();
    if (!specificTargetedFile) {
      alert("not entering here");
      for (let fileId of fileSelection.filesSelected) {
        // not valid because public change between file
        // and it's taking self user public key
        await downloadSpecificFile(fileId, "", privateKeyString);
      }
    } else {
      await downloadSpecificFile(
        specificTargetedFile.id, // we don't care, we care about specificTargetedFile
        fromWallet.data?.did_public_key!,
        privateKeyString,
        { specificTargetedFile },
      );
    }
  };

  return { downloadFiles, downloadSpecificFile };
};

export default useDownloadFiles;
